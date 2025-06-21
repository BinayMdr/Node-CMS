const { DataTypes } = require('sequelize');
const sequelize = require('../database/database');

const Message = sequelize.define('Message', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
  },
  message: {
    type: DataTypes.TEXT,
  },
  order: {
    type: DataTypes.INTEGER,
  }
});

module.exports = Message;