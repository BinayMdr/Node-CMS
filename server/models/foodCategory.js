const { DataTypes } = require('sequelize');
const sequelize = require('../database/database');

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

module.exports = FoodCategory;