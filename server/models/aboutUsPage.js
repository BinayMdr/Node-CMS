const { DataTypes } = require('sequelize');
const sequelize = require('../database/database');

const AboutUsPage = sequelize.define('AboutUsPage', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  value: {
    type: DataTypes.TEXT,
  }
});

module.exports = AboutUsPage;