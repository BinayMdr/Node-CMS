const invoice = require('../models/invoice');
const product = require('../models/product');
const payment = require('../models/payment');
const user = require('../models/user');
const branch = require('../models/branch');
const globalSetting = require('../models/globalsetting');
const invoicehasproduct = require('../models/invoicehasproduct');
const offer = require('../models/offer');
require("dotenv").config();
const { body, validationResult } = require('express-validator');
const {Op,Sequelize} = require('sequelize');
const jwt = require('jsonwebtoken');

const getAllInvoice = (async (req,res) => {
  try {
    let {page,pageSize,startDate,endDate,filter} = req.query;

    if(page == undefined) page = 1;
    if(pageSize == undefined) pageSize = 10;
    
    const offset = (page - 1) * pageSize;
    let where = {};

    if( startDate != "" && endDate != "")
    {
      const startTimestamp = new Date(`${startDate} 00:00:00`);
      const endTimestamp = new Date(`${endDate} 23:59:59`);
      where.createdAt = { [Op.between]: [startTimestamp, endTimestamp] };
    }
    
    if (filter) {
      where.invoice_number = { [Op.like]: `%${filter}%` };
    }

    const decoded = req.decodedData;

    const userData = await user.findOne({
      where: {
        id: decoded['id'],
      }
    }); 

    if(!userData.is_admin) where.branch_id = userData.branch_id;
    

      const invoices = await invoice.findAll({
        where,
        limit: parseInt(pageSize),
        offset,
        order: [['createdAt', 'DESC']], 
        include:[{
          model: branch,
          attributes:['name','is_enabled']
        },
        {
          model: offer,
          attributes:['name','offer_type','discount_off','amount_off']
        }]
      });

    

    for(let i = 0 ; i < invoices.length ; i++)
    {
      invoices[i] = await dataFormatter(invoices[i])
    }

    const totalInvoiceCount = await invoice.count({
      where,
      limit: parseInt(pageSize),
      offset,
      order: [['createdAt', 'DESC']], 
    });
    const pageInfo = {
      "totalData" : parseInt(totalInvoiceCount),
      "currentPage" : parseInt(page),
      "pageSize" : parseInt(pageSize),
      "lastPage" : Math.ceil(parseFloat(totalInvoiceCount/pageSize))
    };

    return res.json({
      "data": invoices,
      "pageInfo": pageInfo,
      "error": false
    });
    
  } catch (error) {
    console.log(error)
    return res.json({
      "message": "Data not found",
      "error": true
    });
  }
});

const storeInvoice = [
  body('customer_name').notEmpty().withMessage('Customer name is required'),
  body('discount_percent').isFloat().withMessage('Discount percent is required'),
  body('invoice_items').notEmpty().withMessage('Item is required'),
  async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { customer_name, discount_percent, invoice_items,received_amount,changed_amount,payment_method_id, offer_id, offer_amount,status } = req.body;

    console.log(req.body)
    try {

        let items = [];
        let subTotal = 0;
        let total = 0;
        let discount_amount = 0;

        for(let i = 0; i < invoice_items.length ; i++ )
        {
            let productItem = await product.findOne({
                where: {id: invoice_items[i]['id']}
            });

            let item = {
                product_id : invoice_items[i]['id'],
                quantity : invoice_items[i]['quantity'],
                price : productItem['dataValues']['price'],
                total : productItem['dataValues']['price'] * invoice_items[i]['quantity']
            };

            items.push(item);
            subTotal = subTotal + ( productItem['dataValues']['price'] * invoice_items[i]['quantity']);
        }

        subTotal = subTotal.toFixed(2);
        discount_amount = (subTotal * (discount_percent/100)).toFixed(2);
        total = (subTotal - discount_amount).toFixed(2);
        if(offer_amount != "") total = (total - offer_amount).toFixed(2);

        const decoded = req.decodedData;

        let latestInvoiceData = await invoice.findOne({
                        order: [['createdAt','DESC']]
                    }); 
        
        let invoiceNumber = null;
        
        const invoicePrefixSetting = await globalSetting.findOne({
            where: {
              name: 'invoicePrefix',
            }
            });
        
        const invoicePrefix = invoicePrefixSetting['dataValues']['value'];

        if(latestInvoiceData)
        {
            const numberPart =  ( parseInt(latestInvoiceData['dataValues']['invoice_number'].split(invoicePrefix).pop()) + 1);

            invoiceNumber = invoicePrefix;

            for (i = 1; i <= 4 - numberPart.toString().length ; i++)
            {
              invoiceNumber += '0'; 
            }

            invoiceNumber += numberPart;

        }
        else
        {
            invoiceNumber = invoicePrefix + "0001";
        }

        let invoiceData = await invoice.create({
            invoice_number: invoiceNumber,
            customer_name: customer_name,
            sub_total: subTotal,
            total: total,
            discount_percent: discount_percent,
            discount_amount: discount_amount,
            received_amount:received_amount,
            changed_amount:changed_amount,
            payment_method_id:payment_method_id,
            branch_id:decoded['branch_id'],
            prepared_by_id:decoded['id'],
            status: status ?? "Pending",
            received_amount: received_amount ?? 0,
            changed_amount: changed_amount ?? 0,
            offer_id: (offer_id != "") ? offer_id : null,
            offer_amount: (offer_amount != "") ? offer_amount : null
        });

        for(let i = 0; i < items.length ; i++ )
        {
            items[i].invoice_id = invoiceData['id'];
        }
        
        await invoicehasproduct.bulkCreate(items); 

        invoiceData = await dataFormatter(invoiceData)
        
      return res.json({
        message: 'Invoice created',
        data: invoiceData,
        error: false,
      });
      
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        message: 'Error in invoice creation',
        error: true,
      });
    }
  },
];

const updateInvoice = [
  body('customer_name').notEmpty().withMessage('Customer name is required'),
  body('discount_percent').isFloat().withMessage('Discount percent is required'),
  body('invoice_items').notEmpty().withMessage('Item is required'),
  body('status').notEmpty().withMessage('Status is required'),
  async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { customer_name, discount_percent, invoice_items,received_amount,changed_amount,payment_method_id,status,offer_id,offer_amount } = req.body;
    const invoiceId = req.params.invoiceId;

    try {
      
      await invoicehasproduct.destroy({
        where: { invoice_id: invoiceId}
      });

      let items = [];
        let subTotal = 0;
        let total = 0;
        let discount_amount = 0;

        for(let i = 0; i < invoice_items.length ; i++ )
        {
            let productItem = await product.findOne({
                where: {id: invoice_items[i]['id']}
            });

            let item = {
                product_id : invoice_items[i]['id'],
                quantity : invoice_items[i]['quantity'],
                price : productItem['dataValues']['price'],
                total : productItem['dataValues']['price'] * invoice_items[i]['quantity']
            };

            items.push(item);
            subTotal = subTotal + ( productItem['dataValues']['price'] * invoice_items[i]['quantity']);
        }

        subTotal = subTotal.toFixed(2)
        discount_amount = (subTotal * (discount_percent/100)).toFixed(2);
        total = (subTotal - discount_amount).toFixed(2);

        if(offer_amount != "") total = (total - offer_amount).toFixed(2);

      let invoiceData = await invoice.update({
        customer_name: customer_name,
        sub_total: subTotal,
        total: total,
        discount_percent: discount_percent,
        discount_amount: discount_amount,
        received_amount:received_amount,
        changed_amount:changed_amount,
        payment_method_id:payment_method_id,
        status: status,
        offer_id: (offer_id != "") ? offer_id : null,
        offer_amount: (offer_amount != "") ? offer_amount : null
      },
      {
        where: { id: invoiceId }
      });

      for(let i = 0; i < items.length ; i++ )
        {
            items[i].invoice_id = invoiceId;
        }
        
      await invoicehasproduct.bulkCreate(items); 

      let updatedInvoice = await invoice.findOne({
        where: {id: invoiceId}
      });

      updatedInvoice = await dataFormatter(updatedInvoice);

      return res.json({
        message: 'Invoice updated',
        data: updatedInvoice,
        error: false,
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Error in invoice update',
        error: true,
      });
    }
  },
];

const getInvoice = (async (req,res) => {
  const invoiceId = req.params.invoiceId;

  let existingInvoice = await invoice.findOne({
    where: {
      id: invoiceId,
    }
  });

  if (existingInvoice) {

    existingInvoice = await dataFormatter(existingInvoice);

    return res.status(400).json({
      data: existingInvoice,
      error: false,
    });
  }

  return res.status(400).json({
    message: "Invoice not found",
    error: true,
  });

});

const dataFormatter = (async (invoice) => {

    const invoiceProducts = await invoice.getInvoiceHasProducts();
      
    let productItems = [];
    for( let i = 0; i < invoiceProducts.length ; i++)
    {
      let productData = await product.findOne({
        where:{id: invoiceProducts[i]['dataValues']['product_id']}
      });

      let productItem = {
        id : invoiceProducts[i]['dataValues']['product_id'],
        name : productData['dataValues']['name'],
        price : invoiceProducts[i]['dataValues']['price'],
        quantity : invoiceProducts[i]['dataValues']['quantity'],
        total : invoiceProducts[i]['dataValues']['total']
      };

      productItems.push(productItem);
    }
    
    invoice['dataValues']['products'] = productItems;
    invoice['dataValues']['payment'] = null;

    if(invoice['dataValues']['payment_method_id'])
    {
        let paymentData = await payment.findOne({
          where: {id: invoice['dataValues']['payment_method_id']}
        });

        invoice['dataValues']['payment'] = paymentData['dataValues']['name'];
    }

    let preparedBy = await user.findOne({
        where: {id: invoice['dataValues']['prepared_by_id']}
    });

    invoice['dataValues']['preparedBy'] = preparedBy['dataValues']['name'];
    
    return invoice;
});
module.exports = {
    getAllInvoice,
    storeInvoice,
    updateInvoice,
    getInvoice
}