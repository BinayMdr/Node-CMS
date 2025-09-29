const aboutUsPage = require('../models/aboutUsPage');
const globalsetting = require('../models/globalsetting')
const gallery = require('../models/gallery')
const homePage =  require('../models/homePage')
const banner =  require('../models/banner')
const customerReview =  require('../models/customerReview')
const foodCategory =  require('../models/foodCategory')
const foodItem =  require('../models/foodItem')
const messageData = require('../models/message');

require("dotenv").config();
const { Op, Sequelize } = require('sequelize');


const getAboutUs = async (req, res) => {
  try {
    const aboutUsData = await aboutUsPage.findOne({
      where: { name: "description" }
    });

     const result = {
      [aboutUsData.name]: aboutUsData.value
    };

    return res.json({
      data: result,
      error: false
    });

  } catch (error) {
    return res.json({
      message: "Data not found",
      error: true
    });
  }
};

const getAllGlobalSetting = async (req, res) => {
  try {
    const globalSettings = await globalsetting.findAll();

    const settingsObj = {};
    globalSettings.forEach(setting => {
      settingsObj[setting.name] = setting.value;
    });

    return res.json({
      data: settingsObj,
      error: false
    });
  } catch (error) {
    return res.json({
      message: "Data not found",
      error: true
    });
  }
};

const getGalleryFiles = async (req, res) => {
  try {
    const files = await gallery.findAll({
      order:[['order','ASC']]
    })

    return res.json({ data: files, error: false });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to read gallery', error: true });
  }
};

const getHomePage = async (req, res) => {
  try {
    const homePageData = await homePage.findAll();

    const homePageKeyValue = {};
    homePageData.forEach(item => {
      const data = item.dataValues; 
      homePageKeyValue[data.name] = data.value;
    });

    return res.json({
      data: homePageKeyValue,
      error: false
    });
  } catch (error) {
    return res.json({
      message: "Data not found",
      error: true
    });
  }
};

const getBanner = async (req, res) => {
  try {
    const bannerData = await banner.findOne({
      where: { is_enabled: 1 },
      order: [['order', 'ASC']],  
    });

    return res.json({
      data: bannerData,
      error: false
    });
  } catch (error) {
    return res.json({
      message: "Data not found",
      error: true
    });
  }
};

const getCustomerReview = async (req, res) => {
  try {
    const customerReviewData = await customerReview.findAll({
       where: { is_enabled: 1 },
      limit: 10,
      order: [['order', 'ASC']],
    });

    return res.json({
      data: customerReviewData,
      error: false
    });
  } catch (error) {
    console.log(error)
    return res.json({
      message: "Data not found",
      error: true
    });
  }
};

const getMenu = async (req, res) => {
  try {
    const foodCategories = await foodCategory.findAll({
      where: { is_enabled: 1 },
      order: [['order', 'ASC']],
      include: [
        {
          model: foodItem,   
          as: 'items',      
          where: { is_enabled: 1 },  
          required: false, 
          order: [['order', 'ASC']]
        }
      ]
    });

    return res.json({
      data: foodCategories,
      error: false
    });

  } catch (error) {
    console.log(error)
    return res.json({
      message: "Data not found",
      error: true
    });
  }
};

// controllers/contactController.js

const storeMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: true, message: "All fields are required" });
    }

   const newMessage = await messageData.create({
      name,
      email,
      message,
    });

    return res.status(201).json({
      error: false,
      message: "Message stored successfully",
      data: { name, email, message }
    });
  } catch (error) {
    console.error("Error saving message:", error);
    return res.status(500).json({
      error: true,
      message: "Internal server error"
    });
  }
};


module.exports = {
  getAboutUs,
  getAllGlobalSetting,
  getGalleryFiles,
  getHomePage,
  getBanner,
  getCustomerReview,
  getMenu,
  storeMessage
};
