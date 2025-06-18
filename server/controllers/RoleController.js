const {Role} = require('../models');
require("dotenv").config();
const { body, validationResult } = require('express-validator');
const {Op,Sequelize} = require('sequelize');


const getAllRole = (async (req,res) => {
  try {
    
    const roles = await Role.findAll({
      where: { parent_role_id: null },
      include: [
        {
          model: Role,
          as: 'children',
          separate: true, 
          order: [['order', 'ASC']]  
        }
      ],
      order: [['order', 'ASC']]  
    });
    

    return res.json({
      "data": roles,
      "error": false
    });
    
  } catch (error) {
    console.log(error)
    return res.json({
      "message": "Data not found",
      "error": true
    });
  }
});

module.exports = {
    getAllRole
}