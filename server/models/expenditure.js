const { DataTypes } = require('sequelize');
const sequelize = require('../database/database');
const expenditureHasProduct = require('./expenditurehasproduct')
const branch = require('./branch')
const User = require("./user");

const Expenditure = sequelize.define('Expenditure', {
  branch_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
   branch_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
   prepared_by_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  total_cost: {
    type: DataTypes.FLOAT,
    allowNull: false,
  }
});

module.exports = Expenditure;

Expenditure.hasMany(expenditureHasProduct, {
    foreignKey: 'expenditure_id'
});

Expenditure.belongsTo(branch,{
    foreignKey: 'branch_id'
})

Expenditure.belongsTo(User,{
    foreignKey: 'prepared_by_id'
});


