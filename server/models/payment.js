const { DataTypes } = require('sequelize');
const sequelize = require('../database/database');

const Payment = sequelize.define('Payment', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  is_enabled: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
});

module.exports = Payment;