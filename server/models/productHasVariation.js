const { DataTypes } = require('sequelize');
const sequelize = require('../database/database');
const Product = require('./product')

const ProductHasVariation = sequelize.define('ProductHasVariations', {
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  colorCombination: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  branch_id:{
    type: DataTypes.INTEGER,
    allowNull: false,
  }
});

module.exports = ProductHasVariation;

