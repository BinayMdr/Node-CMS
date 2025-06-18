const { DataTypes } = require('sequelize');
const sequelize = require('../database/database');
const Branch = require('./branch');

const Role = sequelize.define('Role', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  parent_role_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  order: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
});

module.exports = Role;