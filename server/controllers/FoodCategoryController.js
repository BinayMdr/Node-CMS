const foodCategory = require('../models/foodCategory');
require("dotenv").config();
const { body, validationResult } = require('express-validator');
const {Op,Sequelize} = require('sequelize');


const getAllFoodCategory = (async (req,res) => {
  try {
    let {page,pageSize,filter} = req.query;

    if(page == undefined) page = 1;
    if(pageSize == undefined) pageSize = 10;
    
    const offset = (page - 1) * pageSize;
    let where = {};

    if (filter) {
      where.name = { [Op.like]: `%${filter}%` };
    }

    const foodCategories = await foodCategory.findAll({
      where,
      limit: parseInt(pageSize),
      offset,
      order: [['order', 'ASC']], 
    });

    const totalFoodCategoryCount = await foodCategory.count({
      where,
      limit: parseInt(pageSize),
      offset,
      order: [['order', 'ASC']], 
    });
    
    const pageInfo = {
      "totalData" : parseInt(totalFoodCategoryCount),
      "currentPage" : parseInt(page),
      "pageSize" : parseInt(pageSize),
      "lastPage" : Math.ceil(parseFloat(totalFoodCategoryCount/pageSize))
    };

    return res.json({
      "data": foodCategories,
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

const storeFoodCategory = [
  body('name').notEmpty().withMessage('Name is required'),
  body('status').isBoolean().withMessage('Status must be a boolean'),
  async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, status } = req.body;

    try {
       let maxOrder = await foodCategory.max('order')
      if(maxOrder == null) maxOrder = 0

      const existingFoodCategory = await foodCategory.findOne({
        where: {
          name: name
        },
      });

      if (existingFoodCategory) {
        return res.status(400).json({
          message: 'Food category name already taken',
          error: true,
        });
      }

      const foodCategoryData = await foodCategory.create({
        name: name,
        order: maxOrder + 1,
        is_enabled: status,
      });

      return res.json({
        message: 'Food category created',
        data: foodCategoryData,
        error: false,
      });
    } catch (error) {
      console.error('Error in food category creation:', error);

      return res.status(500).json({
        message: 'Error in food category creation',
        error: true,
      });
    }
  },
];

const updateFoodCategory = [
    body('name').notEmpty().withMessage('Name is required'),
    body('status').isBoolean().withMessage('Status must be a boolean'),
  async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, status } = req.body;
    const foodCategoryId = req.params.foodCategoryId;

    try {
      const existingFoodCategory = await foodCategory.findOne({
        where: {
          name: name,
          id:{
            [Sequelize.Op.not]: foodCategoryId
          }
        }
       
      });

      if (existingFoodCategory) {
        return res.status(400).json({
          message: 'Food category name already taken',
          error: true,
        });
      }

      const updatedFoodCategory = await foodCategory.update({
        name: name,
        is_enabled: status,
      },
      {
        where: { id: foodCategoryId }
      });


      return res.json({
        message: 'Food category updated',
        data: updatedFoodCategory,
        error: false,
      });
    } catch (error) {
      console.error('Error in food category update:', error);

      return res.status(500).json({
        message: 'Error in food category update',
        error: true,
      });
    }
  },
];

const updateFoodCategoryOrder = [
  body('foodCategories').notEmpty().withMessage('Food category is required'),
  async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { foodCategories, page, pageSize} = req.body;

    try {
      
      if(page == 0)
      {
        for(let i= 0; i< foodCategories.length ; i++)
        {
          await foodCategory.update(
            {
              order: i + 1
            },
            {
              where: {
                id: foodCategories[i]['id']
              }
            }
          );
        }
      }
      else
      {
        let startOrder = page * pageSize
       
        for(let i= 0; i< foodCategories.length ; i++)
        {
          startOrder = startOrder + 1
          await foodCategory.update(
            {
              order: startOrder
            },
            {
              where: {
                id: foodCategories[i]['id']
              }
            }
          );
        }
      }

      return res.json({
        message: 'Food category order updated',
        error: false,
      });
    } catch (error) {
      console.error('Error in food category order update:', error);

      return res.status(500).json({
        message: 'Error in food category order update',
        error: true,
      });
    }
  },
];

module.exports = {
    getAllFoodCategory,
    storeFoodCategory,
    updateFoodCategory,
    updateFoodCategoryOrder
}