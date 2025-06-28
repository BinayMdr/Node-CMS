const user = require('../models/user');
const foodCategory = require('../models/foodCategory');
const foodItem = require('../models/foodItem');
const message = require('../models/message');
require("dotenv").config();
const { body, validationResult } = require('express-validator');
const {Op,Sequelize,fn,col,literal} = require('sequelize');


const dashboardDetails = (async (req,res) => {
  try {

    const decoded = req.decodedData;
   
    const userData = await user.findOne({
      where: {
        id: decoded['id'],
      }
    }); 

    const data = {};
    data.foodCategories = await foodCategory.count();
    data.foodItems = await foodItem.count();
    data.messages = await message.count();


    

    return res.json({
        "data": data,
        "error": true
      });
    
  } catch (error) {
    console.log(error)
    return res.json({
      "message": "Data not found",
      "error": true
    });
  }
});


module.exports = {
    dashboardDetails
}