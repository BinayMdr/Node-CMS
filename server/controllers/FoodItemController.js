const foodItem = require('../models/foodItem');
require("dotenv").config();
const { body, validationResult } = require('express-validator');
const {Op,Sequelize} = require('sequelize');
const multer = require('multer');
const path = require('path');
const fs = require('fs');


const getAllFoodItem = (async (req,res) => {
  try {
    let {page,pageSize,filter,food_category_id} = req.query;

    if(page == undefined) page = 1;
    if(pageSize == undefined) pageSize = 10;
    
    const offset = (page - 1) * pageSize;
    let where = {};

    if (filter) {
      where[Op.or] = [
        { name: { [Op.like]: `%${filter}%` } }
      ];
    }

    where.food_category_id = food_category_id

    const foodItems = await foodItem.findAll({
      where,
      limit: parseInt(pageSize),
      offset,
      order: [['order', 'ASC']], 
    });

    
    const totalFoodItemCount = await foodItem.count({
      where,
      limit: parseInt(pageSize),
      offset,
      order: [['createdAt', 'DESC']], 
    });
    
    const pageInfo = {
      "totalData" : parseInt(totalFoodItemCount),
      "currentPage" : parseInt(page),
      "pageSize" : parseInt(pageSize),
      "lastPage" : Math.ceil(parseFloat(totalFoodItemCount/pageSize))
    };

    return res.json({
      "data": foodItems,
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

const storeFoodItem = [
  body('name').notEmpty().withMessage('Name is required'),
  body('is_enabled').isBoolean().withMessage('Is enabled must be a boolean'),
  async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name,is_enabled, food_category_id } = req.body;


    try {
        
        
      let maxOrder = await foodItem.max('order')
      if(maxOrder == null) maxOrder = 0

      const existingFoodItem = await foodItem.findOne({
        where: {
          [Op.and]: [
            { name: name },
            { food_category_id: food_category_id }
          ]
        }
      });

      if (existingFoodItem) {
        return res.status(400).json({
          message: 'Food item name already taken',
          error: true,
        });
      }

      let imagePath = null;
      if(req.file){
        imagePath = path.join('/food-item', req.file.filename).replace(/\\/g, '/');
      }
      
      const FoodItemData = await foodItem.create({
        name: name,
        is_enabled: is_enabled,
        order: maxOrder + 1,
        image: imagePath,
        food_category_id:food_category_id
      });

      return res.json({
        message: 'Food item created',
        data: FoodItemData,
        error: false,
      });
    } catch (error) {
      console.error('Error in food item creation:', error);

      return res.status(500).json({
        message: 'Error in food item creation',
        error: true,
      });
    }
  },
];

const updateFoodItem = [
    body('name').notEmpty().withMessage('Name is required'),
    body('is_enabled').isBoolean().withMessage('Is enabled must be a boolean'),
  async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, is_enabled } = req.body;
    const foodItemId = req.params.foodItemId;

    const foodItemData = await foodItem.findOne({
      where:{
        id:foodItemId
      }
    })

    try {

      const existingFoodItem = await foodItem.findOne({
        where: {
          [Op.and]: [
            { name: name },
            { food_category_id: foodItemData['dataValues']['food_category_id'] },
            { id: { [Op.ne]: foodItemId } }  // ✅ wrap in braces
          ]
        }
      });

      if (existingFoodItem) {
        return res.status(400).json({
          message: 'Food item name already taken',
          error: true,
        });
      }

      let data = {
        name: name,
        is_enabled: is_enabled
      }
      
      let imagePath = null;
      if(req.file !== undefined && req.file){
        imagePath = path.join('/food-item', req.file.filename).replace(/\\/g, '/');
        data.image = imagePath
      }

      await foodItem.update(data,
      {
        where: { id: foodItemId }
      });

      const updatedFoodItem = await foodItem.findOne({
        where: {
          id: foodItemId,
        },
      });

      return res.json({
        message: 'Food item updated',
        data: updatedFoodItem,
        error: false,
      });
    } catch (error) {
      console.error('Error in food item update:', error);

      return res.status(500).json({
        message: 'Error in food item update',
        error: true,
      });
    }
  },
];


const updateFoodItemOrder = [
  body('foodItems').notEmpty().withMessage('Food item is required'),
  async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { foodItems, page, pageSize} = req.body;

    try {
      
      if(page == 0)
      {
        for(let i= 0; i< foodItems.length ; i++)
        {
          await foodItem.update(
            {
              order: i + 1
            },
            {
              where: {
                id: foodItems[i]['id']
              }
            }
          );
        }
      }
      else
      {
        let startOrder = page * pageSize
       
        for(let i= 0; i< foodItems.length ; i++)
        {
          startOrder = startOrder + 1
          await foodItem.update(
            {
              order: startOrder
            },
            {
              where: {
                id: foodItems[i]['id']
              }
            }
          );
        }
      }

      return res.json({
        message: 'Food item order updated',
        error: false,
      });
    } catch (error) {
      console.error('Error in food item order update:', error);

      return res.status(500).json({
        message: 'Error in food item order update',
        error: true,
      });
    }
  },
];

module.exports = {
    getAllFoodItem,
    storeFoodItem,
    updateFoodItem,
    updateFoodItemOrder
}