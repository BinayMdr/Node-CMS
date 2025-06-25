const { DataTypes } = require('sequelize');
const sequelize = require('../database/database');

const Banner = sequelize.define('Banner', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  image: {
    type: DataTypes.TEXT,
  },
   button_title: {
    type: DataTypes.TEXT,
  },
   button_link: {
    type: DataTypes.TEXT,
  },
   is_enabled: {
    type: DataTypes.BOOLEAN,
  },
   order: {
    type: DataTypes.INTEGER,
  }
});

module.exports = Banner;