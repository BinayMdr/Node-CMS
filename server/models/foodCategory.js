const { DataTypes } = require('sequelize');
const sequelize = require('../database/database');
const FoodItem =  require('./foodItem')

const FoodCategory = sequelize.define('FoodCategory', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  is_enabled: {
    type: DataTypes.BOOLEAN,
  },
  order:{
    type:DataTypes.INTEGER
  }
});

FoodCategory.hasMany(FoodItem, { as: 'items', foreignKey: 'food_category_id' });
module.exports = FoodCategory;

