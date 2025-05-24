const { DataTypes } = require('sequelize');
const sequelize = require('../database/database');

const GlobalSetting = sequelize.define('GlobalSetting', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  value: {
    type: DataTypes.STRING,
  }
});

module.exports = GlobalSetting;