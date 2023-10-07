const { DataTypes } = require('sequelize');
const sequelize = require('../database/database');

const Customer = sequelize.define('Customer', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone_number: {
    type: DataTypes.STRING,
    allowNull: false,
  }
});

module.exports = Customer;