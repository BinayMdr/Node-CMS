const banner = require('../models/banner');
require("dotenv").config();
const { body, validationResult } = require('express-validator');
const {Op,Sequelize} = require('sequelize');
const multer = require('multer');
const path = require('path');
const fs = require('fs');


const getAllBanner = (async (req,res) => {
  try {
    let {page,pageSize,filter} = req.query;

    if(page == undefined) page = 1;
    if(pageSize == undefined) pageSize = 10;
    
    const offset = (page - 1) * pageSize;
    let where = {};

    if (filter) {
      where[Op.or] = [
        { name: { [Op.like]: `%${filter}%` } }
      ];
    }

    const banners = await banner.findAll({
      where,
      limit: parseInt(pageSize),
      offset,
      order: [['order', 'ASC']], 
    });

    
    const totalBannerCount = await banner.count({
      where,
      limit: parseInt(pageSize),
      offset,
      order: [['createdAt', 'DESC']], 
    });
    
    const pageInfo = {
      "totalData" : parseInt(totalBannerCount),
      "currentPage" : parseInt(page),
      "pageSize" : parseInt(pageSize),
      "lastPage" : Math.ceil(parseFloat(totalBannerCount/pageSize))
    };

    return res.json({
      "data": banners,
      "pageInfo": pageInfo,
      "error": false
    });
    
  } catch (error) {
    return res.json({
      "message": "Data not found",
      "error": true
    });
  }
});

const storeBanner = [
  body('name').notEmpty().withMessage('Name is required'),
  body('is_enabled').isBoolean().withMessage('Is enabled must be a boolean'),
  async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name,is_enabled, button_link, button_title } = req.body;


    try {
        
        
      let maxOrder = await banner.max('order')
      if(maxOrder == null) maxOrder = 0

      const existingBanner = await banner.findOne({
        where: {
          name: name
        },
      });

      if (existingBanner) {
        return res.status(400).json({
          message: 'Banner name already taken',
          error: true,
        });
      }

      let imagePath = null;
      if(req.file){
        imagePath = path.join('/banner', req.file.filename).replace(/\\/g, '/');
      }
      
      const BannerData = await banner.create({
        name: name,
        button_link: button_link,
        button_title: button_title,
        is_enabled: is_enabled,
        order: maxOrder + 1,
        image: imagePath
      });

      return res.json({
        message: 'Banner created',
        data: BannerData,
        error: false,
      });
    } catch (error) {
      console.error('Error in banner creation:', error);

      return res.status(500).json({
        message: 'Error in banner creation',
        error: true,
      });
    }
  },
];

const updateBanner = [
    body('name').notEmpty().withMessage('Name is required'),
    body('is_enabled').isBoolean().withMessage('Is enabled must be a boolean'),
  async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, button_link, is_enabled,button_title } = req.body;
    const bannerId = req.params.bannerId;

    try {

      const existingBanner = await banner.findOne({
        where: {
          name: name,
          id:{
            [Sequelize.Op.not]: bannerId
          }
        }
       
      });

      if (existingBanner) {
        return res.status(400).json({
          message: 'Banner name already taken',
          error: true,
        });
      }

      let data = {
        name: name,
        is_enabled: is_enabled,
        button_link:button_link,
        button_title:button_title,
      }
      let imagePath = null;
      if(req.file !== undefined && req.file){
        imagePath = path.join('/banner', req.file.filename).replace(/\\/g, '/');
        data.image = imagePath
      }

      await banner.update(data,
      {
        where: { id: bannerId }
      });

      const updatedBanner = await banner.findOne({
        where: {
          id: bannerId,
        },
      });

      return res.json({
        message: 'Banner updated',
        data: updatedBanner,
        error: false,
      });
    } catch (error) {
      console.error('Error in banner update:', error);

      return res.status(500).json({
        message: 'Error in banner update',
        error: true,
      });
    }
  },
];


const updateBannerOrder = [
  body('banners').notEmpty().withMessage('Food category is required'),
  async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { banners, page, pageSize} = req.body;

    try {
      
      if(page == 0)
      {
        for(let i= 0; i< banners.length ; i++)
        {
          await banner.update(
            {
              order: i + 1
            },
            {
              where: {
                id: banners[i]['id']
              }
            }
          );
        }
      }
      else
      {
        let startOrder = page * pageSize
       
        for(let i= 0; i< banners.length ; i++)
        {
          startOrder = startOrder + 1
          await banner.update(
            {
              order: startOrder
            },
            {
              where: {
                id: banners[i]['id']
              }
            }
          );
        }
      }

      return res.json({
        message: 'Banner order updated',
        error: false,
      });
    } catch (error) {
      console.error('Error in banner order update:', error);

      return res.status(500).json({
        message: 'Error in banner order update',
        error: true,
      });
    }
  },
];

module.exports = {
    getAllBanner,
    storeBanner,
    updateBanner,
    updateBannerOrder
}