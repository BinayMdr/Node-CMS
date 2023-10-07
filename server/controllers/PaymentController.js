const payment = require('../models/payment');
require("dotenv").config();
const { body, validationResult } = require('express-validator');
const {Op,Sequelize} = require('sequelize');


const getAllPayment = (async (req,res) => {
  try {
    let {page,pageSize,filter} = req.query;

    if(page == undefined) page = 1;
    if(pageSize == undefined) pageSize = 10;
    
    const offset = (page - 1) * pageSize;
    let where = {};

    if (filter) {
      where.name = { [Op.like]: `%${filter}%` };
    }

    const payments = await payment.findAll({
      where,
      limit: parseInt(pageSize),
      offset
    });

  const totalPaymentCount = await payment.count({
      where,
      limit: parseInt(pageSize),
      offset
    });
    
    const pageInfo = {
      "totalData" : parseInt(totalPaymentCount),
      "currentPage" : parseInt(page),
      "pageSize" : parseInt(pageSize),
      "lastPage" : Math.ceil(parseFloat(totalPaymentCount/pageSize))
    };

    return res.json({
      "data": payments,
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

const storePayment = [
  body('name').notEmpty().withMessage('Name is required'),
  body('is_enabled').isBoolean().withMessage('Is enabled must be a boolean'),
  async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, is_enabled } = req.body;

    try {
      const existingPayment = await payment.findOne({
        where: {
          name: name
        },
      });

      if (existingPayment) {
        return res.status(400).json({
          message: 'Payment name already taken',
          error: true,
        });
      }

      const paymentData = await payment.create({
        name: name,
        is_enabled: is_enabled,
      });

      return res.json({
        message: 'Payment created',
        data: paymentData,
        error: false,
      });
    } catch (error) {
      console.error('Error in payment creation:', error);

      return res.status(500).json({
        message: 'Error in payment creation',
        error: true,
      });
    }
  },
];

const updatePayment = [
  body('name').notEmpty().withMessage('Name is required'),
  body('is_enabled').isBoolean().withMessage('Is enabled must be a boolean'),
  async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, is_enabled } = req.body;
    const paymentId = req.params.paymentId;

    try {
      const existingPayment = await payment.findOne({
        where: {
          name: name,
          id:{
            [Sequelize.Op.not]: paymentId
          }
        }
       
      });

      if (existingPayment) {
        return res.status(400).json({
          message: 'Pyament name already taken',
          error: true,
        });
      }

      const paymentData = await payment.update({
        name: name,
        is_enabled: is_enabled,
      },
      {
        where: { id: paymentId }
      });

      const updatedPayment = await payment.findOne({
        where: {
          id: paymentId,
        },
      });

      return res.json({
        message: 'Payment updated',
        data: updatedPayment,
        error: false,
      });
    } catch (error) {
      console.error('Error in payment update:', error);

      return res.status(500).json({
        message: 'Error in payment update',
        error: true,
      });
    }
  },
];

const getPayment = (async (req,res) => {
  const paymentId = req.params.paymentId;

  const existingPayment = await payment.findOne({
    where: {
      id: paymentId,
    },
  });

  if (existingPayment) {
    return res.status(400).json({
      data: existingPayment,
      error: false,
    });
  }

  return res.status(400).json({
    message: "Payment not found",
    error: true,
  });

});

const getPaymentList = (async (req,res) => {
  try {

    const {filter} = req.query;

    let where = {};

    where.is_enabled =  1 ;

    if (filter) {
      where.name = { [Op.like]: `%${filter}%` };
    }

    const payments = await payment.findAll({
      where,
      order:[
        ['name','ASC']
      ]
    });
    
 
    return res.json({
      "data": payments,
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
    getAllPayment,
    storePayment,
    updatePayment,
    getPayment,
    getPaymentList
}