const customer = require('../models/customer');
require("dotenv").config();
const { body, validationResult } = require('express-validator');
const {Op,Sequelize} = require('sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const getAllCustomer = (async (req,res) => {
  try {
    let {page,pageSize,filter} = req.query;

    if(page == undefined) page = 1;
    if(pageSize == undefined) pageSize = 10;
    
    const offset = (page - 1) * pageSize;
    let where = {};

    if (filter) {
      where[Op.or] = [
        { name: { [Op.like]: `%${filter}%` } },
        { phone_number: { [Op.like]: `%${filter}%` } }
      ];
    }

    const customers = await customer.findAll({
      where,
      limit: parseInt(pageSize),
      offset,
      order: [['createdAt', 'DESC']]
    });

    const totalCustomerCount = await customer.count({
      where,
      limit: parseInt(pageSize),
      offset,
      order: [['createdAt', 'DESC']], 
    });
    
    const pageInfo = {
      "totalData" : parseInt(totalCustomerCount),
      "currentPage" : parseInt(page),
      "pageSize" : parseInt(pageSize),
      "lastPage" : Math.ceil(parseFloat(totalCustomerCount/pageSize))
    };

    return res.json({
      "data": customers,
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

const storeCustomer = [
  body('name').notEmpty().withMessage('Name is required'),
  body('phone_number').notEmpty().withMessage('Phone number is required'),
  async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, phone_number} = req.body;

    try {
      const existingUser = await user.findOne({
        where: {
          phone_number: phone_number
        },
      });

      if (existingUser) {
        return res.status(400).json({
          message: 'Phone number already taken',
          error: true,
        });
      }

      const customerData = await customer.create({
        name: name,
        phone_number: phone_number
      });

      return res.json({
        message: 'Customer created',
        data: customerData,
        error: false,
      });
    } catch (error) {
      console.error('Error in customer creation:', error);

      return res.status(500).json({
        message: 'Error in customer creation',
        error: true,
      });
    }
  },
];

const updateCustomer = [
  body('name').notEmpty().withMessage('Name is required'),
  body('phone_number').notEmpty().withMessage('Phone number is required'),
  async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, phone_number } = req.body;

    const customerId = req.params.customerId;
    try {
      
      let storeData = {
        name: name,
        phone_number: phone_number,
      };

      const customerDataData = await customer.update(storeData,
      {
        where: { id: customerId }
      });

      const updatedCustomer = await customer.findOne({
        where: {
          id: customerId,
        },
      });

      return res.json({
        message: 'Customer updated',
        data: updatedCustomer,
        error: false,
      });
    } catch (error) {
      console.error('Error in customer update:', error);

      return res.status(500).json({
        message: 'Error in customer update',
        error: true,
      });
    }
  },
];

const getCustomer = (async (req,res) => {
  const customerId = req.params.customerId;

  const existingCustomer = await customer.findOne({
    where: {
      id: customerId,
    },
  });

  if (existingCustomer) {
    return res.status(400).json({
      data: existingCustomer,
      error: false,
    });
  }

  return res.status(400).json({
    message: "Customer not found",
    error: true,
  });

});

const getCustomerList = (async (req,res) => {
  try {

    const {filter} = req.query;

    let where = {};

    if (filter) {
      where.name = { [Op.like]: `%${filter}%` };
      where.phone_number = { [Op.like]: `%${filter}%` };
      
    }

    const customers = await customer.findAll({
      where,
      order:[
        ['name','ASC']
      ]
    });
    
 
    return res.json({
      "data": customers,
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
    getAllCustomer,
    storeCustomer,
    updateCustomer,
    getCustomer,
    getCustomerList
}