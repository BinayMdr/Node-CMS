const { DataTypes } = require('sequelize');
const sequelize = require('../database/database');

const Branch = sequelize.define('Branch', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  main_branch: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  is_enabled: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
});

module.exports = Branch;