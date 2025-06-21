const { DataTypes } = require('sequelize');
const sequelize = require('../database/database');

const CustomerReview = sequelize.define('CustomerReview', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  designation: {
    type: DataTypes.STRING,
  },
  ratings: {
    type: DataTypes.STRING,
  },
  review: {
    type: DataTypes.TEXT,
  },
  is_enabled: {
    type: DataTypes.BOOLEAN,
  },
  order:{
    type:DataTypes.INTEGER
  }
});

module.exports = CustomerReview;