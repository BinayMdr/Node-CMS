const user = require('../models/user');
const branch = require('../models/branch');
require("dotenv").config();
const { body, validationResult } = require('express-validator');
const {Op,Sequelize} = require('sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const getAllUser = (async (req,res) => {
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

    where.is_admin = 0;

    const users = await user.findAll({
      where,
      limit: parseInt(pageSize),
      offset,
      order: [['createdAt', 'DESC']], 
      include:[{
        model: branch,
        attributes:['name','is_enabled']
      }]
    });

    const totalUserCount = await user.count({
      where,
      limit: parseInt(pageSize),
      offset,
      order: [['createdAt', 'DESC']], 
    });
    
    const pageInfo = {
      "totalData" : parseInt(totalUserCount),
      "currentPage" : parseInt(page),
      "pageSize" : parseInt(pageSize),
      "lastPage" : Math.ceil(parseFloat(totalUserCount/pageSize))
    };

    return res.json({
      "data": users,
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

const storeUser = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').notEmpty().isEmail().withMessage('Password is required'),
  body('password').notEmpty().withMessage('Password is required'),
  body('is_active').isBoolean().withMessage('Is enabled must be a boolean'),
  body('branch_id').isInt().withMessage('Branch must be a integer'),
  async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, is_active, branch_id,group_id} = req.body;

    try {
      const existingUser = await user.findOne({
        where: {
          email: email
        },
      });

      if (existingUser) {
        return res.status(400).json({
          message: 'Email already taken',
          error: true,
        });
      }

      const encryptedPassword = await bcrypt.hash(password,10);

      const userData = await user.create({
        name: name,
        email: email,
        password: encryptedPassword,
        is_active: is_active,
        branch_id: branch_id,
        is_admin: false,
        group_id: group_id
      });

      return res.json({
        message: 'User created',
        data: userData,
        error: false,
      });
    } catch (error) {
      console.error('Error in user creation:', error);

      return res.status(500).json({
        message: 'Error in user creation',
        error: true,
      });
    }
  },
];

const updateUser = [
  body('branch_id').notEmpty().withMessage('Branch is required'),
  body('is_active').isBoolean().withMessage('Is status must be a boolean'),
  async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { password, branch_id, is_active, group_id } = req.body;

    const userId = req.params.userId;
    try {
      
      let storeData = {
        is_active: is_active,
        branch_id: branch_id,
        group_id: group_id
      };
      if( password != undefined)
      {
        const encryptedPassword = await bcrypt.hash(password,10);
        storeData.password = encryptedPassword
      }
      const userData = await user.update(storeData,
      {
        where: { id: userId }
      });

      const updatedUser = await user.findOne({
        where: {
          id: userId,
        },
      });

      return res.json({
        message: 'User updated',
        data: updatedUser,
        error: false,
      });
    } catch (error) {
      console.error('Error in user update:', error);

      return res.status(500).json({
        message: 'Error in user update',
        error: true,
      });
    }
  },
];

const getUser = (async (req,res) => {
  const userId = req.params.userId;

  const existingUser = await user.findOne({
    where: {
      id: userId,
    },
  });

  if (existingUser) {
    return res.status(400).json({
      data: existingUser,
      error: false,
    });
  }

  return res.status(400).json({
    message: "User not found",
    error: true,
  });

});

const getUserList = (async (req,res) => {
  try {

    const {filter} = req.query;

    let where = {};

    where.is_active =  1 ;

    if (filter) {
      where.name = { [Op.like]: `%${filter}%` };
      where.email = { [Op.like]: `%${filter}%` };
      
    }

    where.is_admin = 0;

    const users = await user.findAll({
      where,
      order:[
        ['name','ASC']
      ]
    });
    
 
    return res.json({
      "data": users,
      "error": false
    });
    
  } catch (error) {
    return res.json({
      "message": "Data not found",
      "error": true
    });
  }
});

const updatePassword = (async (req,res) => {
  try {
    const decoded = req.decodedData;

    const { newPassword, oldPassword } = req.body;

    const { id } = decoded;

    const updatedUser = await user.findOne({
      where: {
        id: id,
      },
    });

    const match = await bcrypt.compare(oldPassword,updatedUser['dataValues']['password']);

    if(!match)
    {
      return res.status(400).json({
        message: "Old password doesn't match",
        error: true,
      });
    }
    const encryptedPassword = await bcrypt.hash(newPassword,10);

    const userData = await user.update({
      password: encryptedPassword
    },
      {
        where: { id: id }
      });


    return res.json({
      message: 'Profile updated',
      error: false,
    });

  } catch (error) {
    return res.json({
      "message": "Data not found",
      "error": true
    });
  }
});
module.exports = {
    getAllUser,
    storeUser,
    updateUser,
    getUser,
    getUserList,
    updatePassword
}