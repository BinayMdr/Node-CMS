const { DataTypes } = require('sequelize');
const sequelize = require('../database/database');
const branch = require('../models/branch')

const OfferHasBranch = sequelize.define('OfferHasBranches', {
  branch_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  offer_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = OfferHasBranch;
