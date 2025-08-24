const { DataTypes } = require('sequelize');
const sequelize = require('../database/database');
const FoodCategory = require('./foodCategory')

const FoodItem = sequelize.define('FoodItem', {
  food_category_id:{
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  image: {
    type: DataTypes.TEXT,
  },
   is_enabled: {
    type: DataTypes.BOOLEAN,
  },
   order: {
    type: DataTypes.INTEGER,
  }
});

module.exports = FoodItem;

