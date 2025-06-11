const expenditure = require('../models/expenditure');
const expenditureHasProduct = require('../models/expenditurehasproduct');
const productHasVariation = require('../models/productHasVariation');
const user = require('../models/user');
const branchModel = require('../models/branch');
const product = require('../models/product')
const history = require('../models/history')

require("dotenv").config();
const { body, validationResult } = require('express-validator');
const {Op,Sequelize} = require('sequelize');
const jwt = require('jsonwebtoken');
const sequelize = require('../database/database')


const getAllExpenditure = (async (req,res) => {
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
    
    const decoded = req.decodedData;

    const userData = await user.findOne({
      where: {
        id: decoded['id'],
      }
    }); 

    if(!userData.is_admin) where.branch_id = userData.branch_id;

    if(filter) 
    {
      const filterData = await branchModel.findOne({
        where:{
          name: filter
        }
      }) 
      where.branch_id = filterData.dataValues.id
    }


    const expenditures = await expenditure.findAll({
        where,
        limit: parseInt(pageSize),
        offset,
        order: [['createdAt', 'DESC']], 
        include:[{
          model: branchModel,
          attributes:['name']
        },
        {
          model: user,
          attributes: ['id','name']
        },
        {
          model: expenditureHasProduct, 
          attributes: ['id', 'name','is_product','quantity','cost'],
          include:[{
            model:product,
            attributes: ['id','model_id','name']
          },{
            model: productHasVariation,
            attributes: ['id','colorCombination']
          }]
        }
      ]
      });

    for(let i = 0; i < expenditures.lenght ; i ++)
    {
      console.log('test')
      console.log(expenditures[i]['ExpenditureHasProduct']['id'])
    }

    const totalExpenditureCount = await expenditure.count({
      where,
      limit: parseInt(pageSize),
      offset,
      order: [['createdAt', 'DESC']], 
    });
    const pageInfo = {
      "totalData" : parseInt(totalExpenditureCount),
      "currentPage" : parseInt(page),
      "pageSize" : parseInt(pageSize),
      "lastPage" : Math.ceil(parseFloat(totalExpenditureCount/pageSize))
    };

    return res.json({
      "data": expenditures,
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

const storeExpenditure = [
  body('branch').notEmpty().withMessage('Branch is required'),
  body('total_amount').isFloat().withMessage('Total amount is required'),
  body('expenditure_items').notEmpty().withMessage('Expenditure items are required'),
  async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {branch, expenditure_items,total_amount} = req.body
    
    const transaction = await sequelize.transaction()

    try {

        const branchData = await branchModel.findOne({
            where: {name:branch}
          })
        
        const decoded = req.decodedData;
        
  
        const expenditureData = await expenditure.create({
            branch_id: branchData.dataValues.id,
            total_cost: total_amount,
            prepared_by_id: decoded['id']
        }, { transaction })

        for(let i=0; i<expenditure_items.length ; i++)
        {
          let variationId = null
          if(expenditure_items[i]['id'] != null)
          {
            const checkVariationExist = await productHasVariation.findOne({
              where:{
                branch_id: branchData.dataValues.id,
                colorCombination: expenditure_items[i]['variation']
              }
            })

            if(!checkVariationExist)
            {
              const newVariation = await productHasVariation.create({
                branch_id: branchData.dataValues.id,
                quantity: expenditure_items[i]['quantity'],
                product_id: expenditure_items[i]['id'],
                colorCombination: expenditure_items[i]['variation']
              }, { transaction });

              variationId = newVariation.dataValues.id

              await history.create({
                product_has_variation_id: variationId,
                previous_quantity: 0,
                new_quantity: expenditure_items[i]['quantity'],
                transaction_type: "Expenditure",
                transaction_id: expenditureData.dataValues.id
              },{transaction})
            }
            else
            {
              await history.create({
                product_has_variation_id: checkVariationExist.dataValues.id,
                previous_quantity: checkVariationExist.dataValues.quantity,
                new_quantity: parseInt(checkVariationExist.dataValues.quantity) + parseInt(expenditure_items[i]['quantity']),
                transaction_type: "Expenditure",
                transaction_id: expenditureData.dataValues.id
              },{transaction})

              await checkVariationExist.update({
                quantity: parseInt(checkVariationExist.dataValues.quantity) + parseInt(expenditure_items[i]['quantity'])
              }, { transaction })

              variationId = checkVariationExist.dataValues.id
              
            }
          }

          await expenditureHasProduct.create({
            expenditure_id: expenditureData.dataValues.id,
            product_id: expenditure_items[i]['id'],
            name: expenditure_items[i]['id'] == null ? expenditure_items[i]['name'] : '',
            quantity: expenditure_items[i]['quantity'],
            cost: expenditure_items[i]['price'],
            product_has_variation_id: variationId,
            is_product: expenditure_items[i]['id'] != null ? true : false
          }, { transaction })

        }
        
      await transaction.commit()
      return res.json({
        message: 'Expenditure created',
        error: false,
      });
      
    } catch (error) {
      console.log(error)
      await transaction.rollback()
      
      return res.status(500).json({
        message: 'Error in expenditure creation',
        error: true,
      });
    }
  },
];


module.exports = {
    getAllExpenditure,
    storeExpenditure
}