const globalsetting = require('../models/globalsetting');
require("dotenv").config();
const { body, validationResult } = require('express-validator');
const {Op,Sequelize} = require('sequelize');


const getAllGlobalSetting = (async (req,res) => {
  try {
    
    const globalSettings = await globalsetting.findAll();

    return res.json({
      "data": globalSettings,
      "error": false
    });
    
  } catch (error) {
    return res.json({
      "message": "Data not found",
      "error": true
    });
  }
});

const updateGlobalSetting = [
  async (req, res) => {
    
    
    try {
      
        Object.entries(req.body).forEach( async (element) => {

            const existingGlobalSetting = await globalsetting.findOne({
                where: {
                  name: element[0]
                }
              });

            if(existingGlobalSetting)
            {
                const oldEntry = await globalsetting.update({
                    value: element[1]
                  },
                  {
                    where: { id: existingGlobalSetting['dataValues']['id'] }
                  });
            }
            else
            {
                const newEntry = await globalsetting.create({
                    name: element[0],
                    value: element[1]
                });
            }
        });

        return res.json({
            message: 'Global setting updated',
            error: false,
        });

    } catch (error) {
      console.error('Error in global setting update:', error);

      return res.status(500).json({
        message: 'Error in global setting update',
        error: true,
      });
    }
  },
];

module.exports = {
    getAllGlobalSetting,
    updateGlobalSetting
}