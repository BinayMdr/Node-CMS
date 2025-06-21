const { DataTypes } = require('sequelize');
const sequelize = require('../database/database');

const HomePage = sequelize.define('HomePage', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  value: {
    type: DataTypes.TEXT,
  }
});

module.exports = HomePage;