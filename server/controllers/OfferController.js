const offer = require('../models/offer');
const product = require('../models/product');
require("dotenv").config();
const { body, validationResult } = require('express-validator');
const {Op,Sequelize} = require('sequelize');
const offerHasBranch =  require('../models/offerhasbranch')
const branchModel = require('../models/branch')
const {Branch} = require('../models')
const user =  require('../models/user')

const getAllOffer = (async (req,res) => {
  try {
    let {page,pageSize,filter} = req.query;

    if(page == undefined) page = 1;
    if(pageSize == undefined) pageSize = 10;
    
    const offset = (page - 1) * pageSize;
    let where = {};
    
    const decoded = req.decodedData;

    const userData = await user.findOne({
      where: {
        id: decoded['id'],
      }
    }); 

    if(!userData.is_admin || filter) 
    {
      let branchId = null
      if(filter)
      {
        const branchData =  await Branch.findOne({
          where:{
            name: filter
          }
        })
        branchId = branchData.dataValues.id
      }
      else
      {
        branchId = userData.branch_id;
      }

      const offerHasBranchData = await offerHasBranch.findAll({
        where:{
          branch_id: branchId
        }
      })

      const ids = offerHasBranchData.map(item => item.dataValues.offer_id);
      
      where.id = 
      {
        [Op.in]: ids
      }
    }

    // if (filter) {
    //   const branchData =  await Branch.findOne({
    //     where:{
    //       name: filter
    //     }
    //   })

    //   const offerHasBranchData = await offerHasBranch.findAll({
    //     where:{
    //       branch_id: branchData.dataValues.id
    //     }
    //   })

    //   const ids = offerHasBranchData.map(item => item.dataValues.offer_id);
      
    //   where.id = 
    //   {
    //     [Op.in]: ids
    //   }
    // }
   
    const offers = await offer.findAll({
      where,
      limit: parseInt(pageSize),
      offset,
      order: [['createdAt', 'DESC']],
      include:{
        model: Branch,
        as: 'branches',
        attributes:['id','name'],
        through:{attributes:[]}
      }
    });

    const totalOfferCount = await offer.count({
      where,
      limit: parseInt(pageSize),
      offset,
      order: [['createdAt', 'DESC']], 
    });
    
    const pageInfo = {
      "totalData" : parseInt(totalOfferCount),
      "currentPage" : parseInt(page),
      "pageSize" : parseInt(pageSize),
      "lastPage" : Math.ceil(parseFloat(totalOfferCount/pageSize))
    };

    return res.json({
      "data": offers,
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

const storeOffer = [
  body('name').notEmpty().withMessage('Name is required'),
  body('offer_type').notEmpty().withMessage('Offer type is required'),
  body('offer_on').notEmpty().withMessage('Offer on is required'),
  body('is_enabled').isBoolean().withMessage('Is enabled must be a boolean'),
  async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { name, offer_type, offer_on, is_enabled ,offer_on_amount, offer_on_product, offer_on_quantity,
          discount_off,amount_off,branch} = req.body;
    
    try {
      const existingOffer = await offer.findOne({
        where: {
          name: name
        },
      });

      if (existingOffer) {
        return res.status(400).json({
          message: 'Offer name already taken',
          error: true,
        });
      }

      let data = {
        'name':name,
        'offer_type': offer_type,
        'offer_on': offer_on,
        'is_enabled': is_enabled
      };

      if(offer_type == "Discount") data.discount_off = discount_off;
      else data.amount_off = amount_off;

      if(offer_on == "Total Price")
      {
        data.offer_on_amount = offer_on_amount;
      }
      else
      {
        data.offer_on_product = offer_on_product;
        data.offer_on_quantity = offer_on_quantity;
      }

      const offerData = await offer.create(data);

      for(let i=0; i<branch.length;i++)
      {
        let branchData = await branchModel.findOne({
          where:{
            name:branch[i]
          }
        })
        await offerHasBranch.create({
          offer_id: offerData.dataValues.id,
          branch_id: branchData.dataValues.id
        })
      }
      return res.json({
        message: 'Offer created',
        data: offerData,
        error: false,
      });
    } catch (error) {
      console.error('Error in offer creation:', error);

      return res.status(500).json({
        message: 'Error in offer creation',
        error: true,
      });
    }
  },
];

const updateOffer = [
  body('name').notEmpty().withMessage('Name is required'),
  body('offer_type').notEmpty().withMessage('Offer type is required'),
  body('offer_on').notEmpty().withMessage('Offer on is required'),
  body('is_enabled').isBoolean().withMessage('Is enabled must be a boolean'),
  async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, offer_type, offer_on, is_enabled ,offer_on_amount, offer_on_product, offer_on_quantity,
          discount_off,amount_off,branch} = req.body;
    const offerId = req.params.offerId;

    
    try {
      const existingOffer = await offer.findOne({
        where: {
          name: name,
          id:{
            [Sequelize.Op.not]: offerId
          }
        }
       
      });

      if (existingOffer) {
        return res.status(400).json({
          message: 'Offer name already taken',
          error: true,
        });
      }

   
      await offerHasBranch.destroy({
        where:{
          offer_id:offerId
        }
      })


      let data = {
        'name':name,
        'offer_type': offer_type,
        'offer_on': offer_on,
        'is_enabled': is_enabled
      };

      if(offer_type == "Discount") 
      {
        data.discount_off = discount_off;
        data.amount_off = null;
      }
      else 
      { 
        data.amount_off = amount_off;
        data.discount_off = null;
      }

      if(offer_on == "Total Price")
      {
        data.offer_on_amount = offer_on_amount;
        data.offer_on_product = null;
        data.offer_on_quantity = null;
      }
      else
      {
        data.offer_on_product = offer_on_product;
        data.offer_on_quantity = offer_on_quantity;
         data.offer_on_amount = null;
      }

      const offerData = await offer.update(data,
      {
        where: { id: offerId }
      });

      const updatedOffer = await offer.findOne({
        where: {
          id: offerId,
        },
      });

      for(let i=0; i<branch.length;i++)
      {
        let branchData = await branchModel.findOne({
          where:{
            name:branch[i]
          }
        })
        await offerHasBranch.create({
          offer_id: offerId,
          branch_id: branchData.dataValues.id
        })
      }

      return res.json({
        message: 'Offer updated',
        data: updatedOffer,
        error: false,
      });
    } catch (error) {
      console.error('Error in offer update:', error);

      return res.status(500).json({
        message: 'Error in offer update',
        error: true,
      });
    }
  },
];

const getOffer = (async (req,res) => {
  const offerId = req.params.offerId;

  const existingOffer = await offer.findOne({
    where: {
      id: offerId,
    },
  });

  if (existingOffer) {
    return res.json({
      data: existingOffer,
      error: false,
    });
  }

  return res.status(400).json({
    message: "Offer not found",
    error: true,
  });

});

const checkOffer = (async (req,res) => {
  let {invoiceItems} = req.query;
  const branch = req.params.branchId;

  let hasOffer = false;
  let offerData = [];
  try{

      const branchData = await Branch.findOne({
        where:{
          name: branch
        }
      })

     
      const offerHasBranchData = await offerHasBranch.findAll({
        where:{
          branch_id:branchData.dataValues.id
        }
      }) 

      const offerIds = offerHasBranchData.map(o => o.offer_id);

      let subTotal = 0;
      for(let i = 0; i < invoiceItems.length ; i++ )
      {
          let productItem = await product.findOne({
              where: {id: invoiceItems[i]['id']}
          });

          subTotal = subTotal + ( productItem['dataValues']['price'] * invoiceItems[i]['quantity']);
      }

      let offerExist = await offer.findOne({
        where: {
           id: {
            [Op.in]: offerIds
          },
          offer_on_amount: {
            [Op.lte]: subTotal
          },
          is_enabled: true
        }
      });

      if(offerExist != null) 
      {
        hasOffer = true;
        offerData = offerExist
      }
        

      if(!hasOffer)
      {
        for(let i = 0 ; i < invoiceItems.length ; i ++)
        {
          let offerExist = await offer.findOne({
            where: {
             [Op.and]: [
              { id: { [Op.in]: offerIds } },
              { offer_on_product: invoiceItems[i]['id'] },
              { offer_on_quantity: { [Op.lte]: invoiceItems[i]['quantity'] } },
              { is_enabled: true }
            ]
            }
          });
          
          if(offerExist != null) 
          {
            hasOffer = true;
            offerData = offerExist
            break;
          }
        } 
      }

      return res.json({
        data: offerData ?? null,
        error: false,
      });

  }
  catch(ex)
  {
    console.log(ex)
  }
});

module.exports = {
    getAllOffer,
    storeOffer,
    updateOffer,
    getOffer,
    checkOffer
}