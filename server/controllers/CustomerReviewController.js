const customerReview = require('../models/customerReview');
require("dotenv").config();
const { body, validationResult } = require('express-validator');
const {Op,Sequelize} = require('sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const getAllCustomerReview = (async (req,res) => {
  try {
    let {page,pageSize,filter} = req.query;

    if(page == undefined) page = 1;
    if(pageSize == undefined) pageSize = 10;
    
    const offset = (page - 1) * pageSize;
    let where = {};

    if (filter) {
      where[Op.or] = [
        { name: { [Op.like]: `%${filter}%` } },
        { email: { [Op.like]: `%${filter}%` } }
      ];
    }

    const customerReviews = await customerReview.findAll({
      where,
      limit: parseInt(pageSize),
      offset,
      order: [['order', 'ASC']]
    });

    const totalCustomerReviewCount = await customerReview.count({
      where,
      limit: parseInt(pageSize),
      offset,
      order: [['order', 'ASC']], 
    });
    
    const pageInfo = {
      "totalData" : parseInt(totalCustomerReviewCount),
      "currentPage" : parseInt(page),
      "pageSize" : parseInt(pageSize),
      "lastPage" : Math.ceil(parseFloat(totalCustomerReviewCount/pageSize))
    };

    return res.json({
      "data": customerReviews,
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

const storeCustomerReview = [
  body('name').notEmpty().withMessage('Name is required'),
  body('review').notEmpty().withMessage('Review is required'),
  async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, review, designation, ratings, status} = req.body;

    try {

      let maxOrder = await customerReview.max('order')
      if(maxOrder == null) maxOrder = 0

    
      const customerReviewData = await customerReview.create({
        name: name,
        review:review,
        designation:designation,
        order: maxOrder + 1,
        is_enabled: status,
        ratings: ratings
      });

      return res.json({
        message: 'Customer review created',
        data: customerReviewData,
        error: false,
      });
    } catch (error) {
      console.error('Error in customer review creation:', error);

      return res.status(500).json({
        message: 'Error in customer review creation',
        error: true,
      });
    }
  },
];

const updateCustomerReview = [
  body('name').notEmpty().withMessage('Name is required'),
  body('review').notEmpty().withMessage('Review is required'),
  async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, review, designation,ratings,status} = req.body;

    const customerReviewId = req.params.customerReviewId;
    try {
      
      let storeData = {
        name: name,
        review: review,
        designation: designation,
        ratings: ratings,
        is_enabled: status
      };

      const customerReviewData = await customerReview.update(storeData,
      {
        where: { id: customerReviewId }
      });

      const updatedCustomerReview = await customerReview.findOne({
        where: {
          id: customerReviewId,
        },
      });

      return res.json({
        message: 'Customer review updated',
        data: updatedCustomerReview,
        error: false,
      });
    } catch (error) {
      console.error('Error in custome review update:', error);

      return res.status(500).json({
        message: 'Error in custome review update',
        error: true,
      });
    }
  },
];


module.exports = {
    getAllCustomerReview,
    storeCustomerReview,
    updateCustomerReview
}