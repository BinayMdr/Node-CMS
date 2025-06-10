const role = require('../models/role');
require("dotenv").config();
const { body, validationResult } = require('express-validator');
const {Op,Sequelize} = require('sequelize');


const getAllRole = (async (req,res) => {
  try {
    
    const roles = await Role.findAll({
      where: { parentId: null },
      include: [
        {
          model: Role,
          as: 'children'
        }
      ]
    });
    

    return res.json({
      "data": roles,
      "error": false
    });
    
  } catch (error) {
    return res.json({
      "message": "Data not found",
      "error": true
    });
  }
});

module.exports = {
    getAllRole
}