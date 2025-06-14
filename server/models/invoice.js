const { DataTypes } = require('sequelize');
const sequelize = require('../database/database');
const Branch = require("./branch");
const Customer = require("./customer");
const User = require("./user");
const PaymentMethod = require("./payment");
const InvoiceHasProduct = require("./invoicehasproduct");
const Offer = require("./offer");

const Invoice = sequelize.define('Invoice', {
  invoice_number: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  customer_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  customer_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  sub_total: {
    type: DataTypes.STRING,
  },
  discount_percent: {
    type: DataTypes.STRING,
  },
  discount_amount: {
    type: DataTypes.STRING,
  },
  total: {
    type: DataTypes.STRING,
  },
  received_amount: {
    type: DataTypes.STRING,
  },
  changed_amount: {
    type: DataTypes.STRING,
  },
  payment_method_id: {
    type: DataTypes.INTEGER,
    allowNull:true
  },
  prepared_by_id: {
    type: DataTypes.INTEGER,
  },
  status: {
    type: DataTypes.STRING,
  },
  branch_id: {
    type: DataTypes.INTEGER,
  },
  offer_id:{
    type: DataTypes.INTEGER
  },
  offer_amount:{
    type:DataTypes.FLOAT
  }
});

Invoice.belongsTo(Branch, {
  foreignKey: {
    name: 'branch_id'
  }
});

Invoice.belongsTo(PaymentMethod,{
  foreignKey:{
    name: 'payment_method_id'
  }
});

Invoice.belongsTo(User,{
  foreignKey:{
    name: 'prepared_by_id'
  }
});

Invoice.belongsTo(Customer,{
  foreignKey:{
    name: 'customer_id'
  }
});

Invoice.hasMany(InvoiceHasProduct, {
  foreignKey: {
    name: 'invoice_id'
  }
});

Invoice.belongsTo(Offer, {
  foreignKey: {
    name: 'offer_id'
  }
});
module.exports = Invoice;