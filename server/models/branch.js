const { DataTypes } = require('sequelize');
const sequelize = require('../database/database');
const OfferHasBranch = require('./offerhasbranch')
const Offer = require('./offer')

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

Branch.belongsToMany(Offer, {
  through: OfferHasBranch,
  foreignKey: 'branch_id',
  otherKey: 'offer_id',
  as: 'offers',
});