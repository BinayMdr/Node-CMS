const setting = require('../models/setting');
require("dotenv").config();
const { body, validationResult } = require('express-validator');
const {Op,Sequelize} = require('sequelize');


const getSetting = (async (req,res) => {
  try {
    
    const branchId = req.query.branchId;
    
    const settings = await setting.findOne({
        where: { branch_id: branchId}
    });

    return res.json({
      "data": settings,
      "error": false
    });
    
  } catch (error) {
    return res.json({
      "message": "Data not found",
      "error": true
    });
  }
});

const updateSetting = [
  async (req, res) => {
    
    const {branchId,address,number} = req.body;
    try {
      
        const existingSetting = await setting.findOne({
            where: {
                branch_id: branchId
            }
            });
        
        let messageText = "Setting created";
        if(existingSetting)
        {
            const oldEntry = await setting.update({
                address: address,
                number: number
                },
                {
                where: { id: existingSetting['dataValues']['id'] }
                });
            messageText = "Setting updated";
        }
        else
        {
            const newEntry = await setting.create({
                branch_id: branchId,
                address: address,
                number: number
            });
        }


        return res.json({
            message: messageText,
            error: false,
        });

    } catch (error) {
      console.error('Error in setting update:', error);

      return res.status(500).json({
        message: 'Error in setting update',
        error: true,
      });
    }
  },
];

module.exports = {
    getSetting,
    updateSetting
}