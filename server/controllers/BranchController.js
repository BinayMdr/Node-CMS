const branch = require('../models/branch');
require("dotenv").config();
const { body, validationResult } = require('express-validator');
const {Op,Sequelize} = require('sequelize');


const getAllBranch = (async (req,res) => {
  try {
    let {page,pageSize,filter} = req.query;

    if(page == undefined) page = 1;
    if(pageSize == undefined) pageSize = 10;
    
    const offset = (page - 1) * pageSize;
    let where = {};

    if (filter) {
      where.name = { [Op.like]: `%${filter}%` };
    }

    const branches = await branch.findAll({
      where,
      limit: parseInt(pageSize),
      offset,
      order: [['createdAt', 'DESC']],
    });

    const totalBranchCount = await branch.count({
      where,
      limit: parseInt(pageSize),
      offset,
      order: [['createdAt', 'DESC']], 
    });
    
    const pageInfo = {
      "totalData" : parseInt(totalBranchCount),
      "currentPage" : parseInt(page),
      "pageSize" : parseInt(pageSize),
      "lastPage" : Math.ceil(parseFloat(totalBranchCount/pageSize))
    };

    return res.json({
      "data": branches,
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

const storeBranch = [
  body('name').notEmpty().withMessage('Name is required'),
  body('main_branch').isBoolean().withMessage('Main branch must be a boolean'),
  body('is_enabled').isBoolean().withMessage('Is enabled must be a boolean'),
  async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, main_branch, is_enabled } = req.body;

    try {
      const existingBranch = await branch.findOne({
        where: {
          name: name
        },
      });

      if (existingBranch) {
        return res.status(400).json({
          message: 'Branch name already taken',
          error: true,
        });
      }

      if (main_branch) {
        const mainBranch = await branch.findOne({
          where: {
            main_branch: true,
          },
        });

        if (mainBranch) {
          return res.status(400).json({
            message: 'There should be only one main branch',
            error: true,
          });
        }
      }

      const branchData = await branch.create({
        name: name,
        main_branch: main_branch,
        is_enabled: is_enabled,
      });

      return res.json({
        message: 'Branch created',
        data: branchData,
        error: false,
      });
    } catch (error) {
      console.error('Error in branch creation:', error);

      return res.status(500).json({
        message: 'Error in branch creation',
        error: true,
      });
    }
  },
];

const updateBranch = [
  body('name').notEmpty().withMessage('Name is required'),
  body('main_branch').isBoolean().withMessage('Main branch must be a boolean'),
  body('is_enabled').isBoolean().withMessage('Is enabled must be a boolean'),
  async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, main_branch, is_enabled } = req.body;
    const branchId = req.params.branchId;

    try {
      const existingBranch = await branch.findOne({
        where: {
          name: name,
          id:{
            [Sequelize.Op.not]: branchId
          }
        }
       
      });

      if (existingBranch) {
        return res.status(400).json({
          message: 'Branch name already taken',
          error: true,
        });
      }

      if (main_branch) {
        const mainBranch = await branch.findOne({
          where: {
            main_branch: true,      
            id:{
              [Sequelize.Op.not]: branchId
            }
          }
        });

        if (mainBranch) {
          return res.status(400).json({
            message: 'There should be only one main branch',
            error: true,
          });
        }
      }

      const branchData = await branch.update({
        name: name,
        main_branch: main_branch,
        is_enabled: is_enabled,
      },
      {
        where: { id: branchId }
      });

      const updatedBranch = await branch.findOne({
        where: {
          id: branchId,
        },
      });

      return res.json({
        message: 'Branch updated',
        data: updatedBranch,
        error: false,
      });
    } catch (error) {
      console.error('Error in branch update:', error);

      return res.status(500).json({
        message: 'Error in branch update',
        error: true,
      });
    }
  },
];

const getBranch = (async (req,res) => {
  const branchId = req.params.branchId;

  const existingBranch = await branch.findOne({
    where: {
      id: branchId,
    },
  });

  if (existingBranch) {
    return res.status(400).json({
      data: existingBranch,
      error: false,
    });
  }

  return res.status(400).json({
    message: "Branch not found",
    error: true,
  });

});

const getBranchList = (async (req,res) => {
  try {

    const {filter} = req.query;

    let where = {};

    where.is_enabled =  1 ;

    if (filter) {
      where.name = { [Op.like]: `%${filter}%` };
    }

    const branches = await branch.findAll({
      where,
      order:[
        ['name','ASC']
      ]
    });
    
 
    return res.json({
      "data": branches,
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
    getAllBranch,
    storeBranch,
    updateBranch,
    getBranch,
    getBranchList
}