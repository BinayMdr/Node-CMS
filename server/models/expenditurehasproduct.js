const { DataTypes } = require('sequelize');
const sequelize = require('../database/database');
const product = require('./product')
const productHasVariation =  require('./productHasVariation')

const ExpenditureHasProduct = sequelize.define('ExpenditureHasProducts', {
  expenditure_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
   is_product: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  product_id:{
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  product_has_variation_id:{
    type: DataTypes.STRING,
    allowNull: true,
  },
   quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
   cost: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
});

module.exports = ExpenditureHasProduct;

ExpenditureHasProduct.belongsTo(product,{
  foreignKey: 'product_id'
})

ExpenditureHasProduct.belongsTo(productHasVariation,{
  foreignKey: 'product_has_variation_id'
})