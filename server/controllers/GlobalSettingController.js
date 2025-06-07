const globalsetting = require('../models/globalsetting');
require("dotenv").config();
const { Op, Sequelize } = require('sequelize');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Multer config to store uploaded images in 'uploads' folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Controller to get all global settings (no changes needed)
const getAllGlobalSetting = async (req, res) => {
  try {
    const globalSettings = await globalsetting.findAll();

    return res.json({
      data: globalSettings,
      error: false
    });
  } catch (error) {
    return res.json({
      message: "Data not found",
      error: true
    });
  }
};

const updateGlobalSetting = [
  async (req, res) => {
    try {
      if (req.file) {
        req.body.bannerImage = req.file.filename;
      }

      const folder = 'global-settings'

      for (const [name, value] of Object.entries(req.body)) {
        let valToSave = value;

        const existingGlobalSetting = await globalsetting.findOne({ where: { name } });

        if(name === 'bannerImage')
        {
          const filePath = path.join(process.cwd(), 'uploads', existingGlobalSetting.value);

          fs.unlink(filePath, (err) => {
            if (err) {
              console.error('Failed to delete file:', err);
            } else {
              console.log('File deleted successfully:', filePath);
            }
          });
        }

        if (name === 'bannerImage' && req.file) {
          valToSave = `${folder}/${req.file.filename}`;
        }
      
        if (existingGlobalSetting) {
          await globalsetting.update(
            { value: valToSave },
            { where: { id: existingGlobalSetting.dataValues.id } }
          );
        } else {
          await globalsetting.create({ name, valToSave });
        }


      }

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
  }
];

module.exports = {
  getAllGlobalSetting,
  updateGlobalSetting,
  upload, // export if you want to reuse multer middleware elsewhere
};
