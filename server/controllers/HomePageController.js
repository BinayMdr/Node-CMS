const homePage = require('../models/homePage');
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

const getHomePage = async (req, res) => {
  try {
    const homePageData = await homePage.findAll();

    return res.json({
      data: homePageData,
      error: false
    });
  } catch (error) {
    return res.json({
      message: "Data not found",
      error: true
    });
  }
};

const updateHomePage = [
  async (req, res) => {
    try {
      const folder = 'home';
      const uploadedFiles = req.files || {};

      // Attach uploaded image file paths to req.body
      ['image1', 'image2', 'image3'].forEach((img) => {
        if (uploadedFiles[img]?.[0]) {
          req.body[img] = `${folder}/${uploadedFiles[img][0].filename}`;
        }
      });

      for (const [name, value] of Object.entries(req.body)) {
        let valToSave = value;

        // If it's an image field and a new file was uploaded
        if (['image1', 'image2', 'image3'].includes(name) && uploadedFiles[name]?.[0]) {
          const existing = await homePage.findOne({ where: { name } });

          if (existing?.value) {
            const oldPath = path.join(process.cwd(), 'uploads', existing.value);
            fs.unlink(oldPath, (err) => {
              if (err) console.error('Failed to delete old image:', err);
              else console.log('Deleted old image:', oldPath);
            });
          }
        }

        // Update or create record in DB
        const existingField = await homePage.findOne({ where: { name } });

        if (existingField) {
          await homePage.update(
            { value: valToSave },
            { where: { id: existingField.id } }
          );
        } else {
          await homePage.create({ name, value: valToSave });
        }
      }

      return res.json({
        message: 'Home data updated successfully',
        error: false
      });
    } catch (error) {
      console.error('Error updating home data:', error);
      return res.status(500).json({
        message: 'Error in home update',
        error: true
      });
    }
  }
];


module.exports = {
  getHomePage,
  updateHomePage,
  upload, 
};
