const { DataTypes } = require('sequelize');
const sequelize = require('../database/database');


const Offer = sequelize.define('Offer', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  offer_type: {
    type: DataTypes.STRING,
  },
  offer_on: {
    type: DataTypes.STRING,
  },
  offer_on_amount: {
    type: DataTypes.STRING,
    allowNull: true
  },
  offer_on_product: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  offer_on_quantity: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  discount_off: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  amount_off: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  is_enabled:{
    type: DataTypes.BOOLEAN
  }
});


module.exports = Offer;



