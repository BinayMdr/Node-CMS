const { DataTypes } = require('sequelize');
const sequelize = require('../database/database');

const Gallery = sequelize.define('Gallery', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  image: {
    type: DataTypes.TEXT,
  },
  order: {
    type: DataTypes.INTEGER,
  }
});

module.exports = Gallery;