const { DataTypes } = require('sequelize');
const sequelize = require('../database/database');
const Group = require('./group');

const GroupHasRole = sequelize.define('GroupHasRole', {
  group_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  role_id: {
    type: DataTypes.INTEGER,
  }
});

module.exports = GroupHasRole;
