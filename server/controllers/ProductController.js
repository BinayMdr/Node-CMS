const product = require('../models/product');
require("dotenv").config();
const { body, validationResult } = require('express-validator');
const {Op,Sequelize} = require('sequelize');


const getAllProduct = (async (req,res) => {
  try {
    let {page,pageSize,filter} = req.query;

    if(page == undefined) page = 1;
    if(pageSize == undefined) pageSize = 10;
    
    const offset = (page - 1) * pageSize;
    let where = {};

    if (filter) {
      where[Op.or] = [
        { name: { [Op.like]: `%${filter}%` } },
        { model_id: { [Op.like]: `%${filter}%` } }
      ];
    }

    const products = await product.findAll({
      where,
      limit: parseInt(pageSize),
      offset,
      order: [['createdAt', 'DESC']], 
    });

    const totalProductCount = await product.count({
      where,
      limit: parseInt(pageSize),
      offset,
      order: [['createdAt', 'DESC']], 
    });
    
    const pageInfo = {
      "totalData" : parseInt(totalProductCount),
      "currentPage" : parseInt(page),
      "pageSize" : parseInt(pageSize),
      "lastPage" : Math.ceil(parseFloat(totalProductCount/pageSize))
    };

    return res.json({
      "data": products,
      "pageInfo": pageInfo,
      "error": false
    });
    
  } catch (error) {
    return res.json({
      "message": "Data not found",
      "error": true
    });
  }
});

const storeProduct = [
  body('name').notEmpty().withMessage('Name is required'),
  body('price').notEmpty().withMessage('Price is required').
                isFloat({min:0}).withMessage('Price must be in number'),
  body('is_enabled').isBoolean().withMessage('Is enabled must be a boolean'),
  body('model_id').notEmpty().withMessage('Model Id is required'),
  async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, price, is_enabled, model_id } = req.body;

    try {
      const existingProductWithModelId = await product.findOne({
        where:{
          model_id:model_id
        }
      })

      if (existingProductWithModelId) {
        return res.status(400).json({
          message: 'Model Id already taken',
          error: true,
        });
      }


      const existingProduct = await product.findOne({
        where: {
          name: name
        },
      });

      if (existingProduct) {
        return res.status(400).json({
          message: 'Product name already taken',
          error: true,
        });
      }

      const productData = await product.create({
        name: name,
        price: price,
        is_enabled: is_enabled,
        model_id: model_id
      });

      return res.json({
        message: 'Product created',
        data: productData,
        error: false,
      });
    } catch (error) {
      console.error('Error in product creation:', error);

      return res.status(500).json({
        message: 'Error in product creation',
        error: true,
      });
    }
  },
];

const updateProduct = [
    body('name').notEmpty().withMessage('Name is required'),
    body('price').notEmpty().withMessage('Price is required').
                  isFloat({min:0}).withMessage('Price must be in number'),
    body('is_enabled').isBoolean().withMessage('Is enabled must be a boolean'),
    body('model_id').notEmpty().withMessage('Model Id is required'),
  async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, price, is_enabled,model_id } = req.body;
    const productId = req.params.productId;

    try {
      const existingProductWithModelId = await product.findOne({
        where:{
          model_id:model_id,
          id:{
            [Sequelize.Op.not]: productId
          }
        }
      })

      if (existingProductWithModelId) {
        return res.status(400).json({
          message: 'Model Id already taken',
          error: true,
        });
      }

      const existingProduct = await product.findOne({
        where: {
          name: name,
          id:{
            [Sequelize.Op.not]: productId
          }
        }
       
      });

      if (existingProduct) {
        return res.status(400).json({
          message: 'Product name already taken',
          error: true,
        });
      }

      const productData = await product.update({
        name: name,
        price: price,
        is_enabled: is_enabled,
        model_id:model_id
      },
      {
        where: { id: productId }
      });

      const updatedProduct = await product.findOne({
        where: {
          id: productId,
        },
      });

      return res.json({
        message: 'Product updated',
        data: updatedProduct,
        error: false,
      });
    } catch (error) {
      console.error('Error in product update:', error);

      return res.status(500).json({
        message: 'Error in product update',
        error: true,
      });
    }
  },
];

const getProduct = (async (req,res) => {
  const productId = req.params.productId;

  const existingProduct = await product.findOne({
    where: {
      id: productId,
    },
  });

  if (existingProduct) {
    return res.status(400).json({
      data: existingProduct,
      error: false,
    });
  }

  return res.status(400).json({
    message: "Product not found",
    error: true,
  });

});

const getProductList = (async (req,res) => {
  try {

    const {filter} = req.query;

    let where = {};

    // where.is_enabled =  1 ;

    if (filter) {
      where[Op.or] = [
        { name: { [Op.like]: `%${filter}%` } },
        { model_id: { [Op.like]: `%${filter}%` } }
      ];
    }

    const products = await product.findAll({
      where,
      order:[
        ['name','ASC']
      ]
    });
    
 
    return res.json({
      "data": products,
      "error": false
    });
    
  } catch (error) {
    return res.json({
      "message": "Data not found",
      "error": true
    });
  }
});
module.exports = {
    getAllProduct,
    storeProduct,
    updateProduct,
    getProduct,
    getProductList
}