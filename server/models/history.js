const { DataTypes } = require('sequelize');
const sequelize = require('../database/database');

const History = sequelize.define('History', {
  product_has_variation_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  previous_quantity: {
    type: DataTypes.INTEGER,
  },
  new_quantity: {
    type: DataTypes.INTEGER,
  },
  transaction_type: {
    type: DataTypes.STRING,
  },
  transaction_id: {
    type: DataTypes.INTEGER,
  }
});

module.exports = History;