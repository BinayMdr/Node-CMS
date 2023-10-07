const { DataTypes } = require('sequelize');
const sequelize = require('../database/database');
const Invoice = require('./invoice')

const InvoiceHasProduct = sequelize.define('InvoiceHasProduct', {
  invoice_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  price: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  total: {
    type: DataTypes.STRING,
    allowNull: false,
  }
});

InvoiceHasProduct.belongsTo(Invoice,{
  foreignKey:{
    name: 'invoice_id'
  }
});


module.exports = InvoiceHasProduct;