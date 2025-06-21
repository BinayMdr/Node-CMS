const aboutUsPage = require('../models/aboutUsPage');
require("dotenv").config();
const { Op, Sequelize } = require('sequelize');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

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

const getAboutUs = async (req, res) => {
  try {
    const aboutUsData = await aboutUsPage.findAll();

    return res.json({
      data: aboutUsData,
      error: false
    });
  } catch (error) {
    return res.json({
      message: "Data not found",
      error: true
    });
  }
};

const updateAboutUs = [
  async (req, res) => {
    try {
   
      if (req.file) {
        req.body.image = req.file.filename;
      }

      const folder = 'about-us'

      for (const [name, value] of Object.entries(req.body)) {
        let valToSave = value;

        const existingAboutUsData = await aboutUsPage.findOne({ where: { name } });

        if(existingAboutUsData && name === 'image' && existingAboutUsData.value != null)
        {
          const filePath = path.join(process.cwd(), 'uploads', existingAboutUsData.value);

          fs.unlink(filePath, (err) => {
            if (err) {
              console.error('Failed to delete file:', err);
            } else {
              console.log('File deleted successfully:', filePath);
            }
          });
        }

        if (name === 'image' && req.file) {
          valToSave = `${folder}/${req.file.filename}`;
        }
      
        if (existingAboutUsData) {
          await aboutUsPage.update(
            { value: valToSave },
            { where: { id: existingAboutUsData.dataValues.id } }
          );
        } else {
          await aboutUsPage.create({ name, valToSave });
        }


      }

      return res.json({
        message: 'About us updated',
        error: false,
      });
    } catch (error) {

      console.error('Error in about us update:', error);
      return res.status(500).json({
        message: 'Error in about us update',
        error: true,
      });
    }
  }
];

module.exports = {
  getAboutUs,
  updateAboutUs,
  upload, 
};
