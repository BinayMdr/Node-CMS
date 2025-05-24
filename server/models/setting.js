const { DataTypes } = require('sequelize');
const sequelize = require('../database/database');
const Branch = require('./branch');

const Setting = sequelize.define('Setting', {
  branch_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  number: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

Setting.belongsTo(Branch, {
  foreignKey: {
    name: 'branch_id'
  }
});

module.exports = Setting;