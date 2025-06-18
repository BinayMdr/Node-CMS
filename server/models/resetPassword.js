const { DataTypes } = require('sequelize');
const sequelize = require('../database/database');


const ResetPassword = sequelize.define('ResetPasswords', {
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  token: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  is_expired: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  }
});

module.exports = ResetPassword;

