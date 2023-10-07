const { DataTypes } = require('sequelize');
const sequelize = require('../database/database');

const Product = sequelize.define('Product', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  is_enabled: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
});

module.exports = Product;