const { Group,GroupHasRole} = require('../models');
const role = require('../models/role');
require("dotenv").config();
const { body, validationResult } = require('express-validator');
const {Op,Sequelize} = require('sequelize');

const getAllGroup = (async (req,res) => {
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

    const superAdmin = await Group.findOne({
      where:{
        name: "Super Admin"
      }
    })

    where.id = { [Op.not]: superAdmin.dataValues.id }
    
    const groups = await Group.findAll({
      where,
      limit: parseInt(pageSize),
      offset,
      order: [['createdAt', 'DESC']], 
      include:[
        {
          model: GroupHasRole,
          attributes:['role_id']
        }
      ]
    });

    const totalGroupCount = await Group.count({
      where,
      limit: parseInt(pageSize),
      offset,
      order: [['createdAt', 'DESC']], 
    });
    
    const pageInfo = {
      "totalData" : parseInt(totalGroupCount),
      "currentPage" : parseInt(page),
      "pageSize" : parseInt(pageSize),
      "lastPage" : Math.ceil(parseFloat(totalGroupCount/pageSize))
    };

    return res.json({
      "data": groups,
      "pageInfo": pageInfo,
      "error": false
    });
    
  } catch (error) {
    console.log(error)
    return res.json({
      "message": "Data not found",
      "error": true
    });
  }
});

const storeGroup = [
  body('name').notEmpty().withMessage('Name is required'),
  async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, role_id} = req.body;

    try {
      const existingGroup = await Group.findOne({
        where: {
          name: name
        },
      });

      if (existingGroup) {
        return res.status(400).json({
          message: 'Name already taken',
          error: true,
        });
      }

      const groupData = await Group.create({
        name: name
      });

      for(let i = 0 ; i < role_id.length; i++)
      {
        await GroupHasRole.create({
          group_id: groupData.dataValues.id,
          role_id: role_id[i]
        })
      }

      return res.json({
        message: 'Group created',
        data: groupData,
        error: false,
      });
    } catch (error) {
      console.error('Error in group creation:', error);

      return res.status(500).json({
        message: 'Error in group creation',
        error: true,
      });
    }
  },
];

const updateGroup = [
  body('name').notEmpty().withMessage('Name is required'),
  async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, role_id} = req.body;

    const groupId = req.params.groupId;
    try {
      
      const existingGroup = await Group.findOne({
        where: {
          name: name,
          id: {
            [Op.not]: groupId
          }
        },
      });

      if (existingGroup) {
        return res.status(400).json({
          message: 'Name already taken',
          error: true,
        });
      }

      let storeData = {
        name: name
      };

      const groupData = await Group.update(storeData,
      {
        where: { id: groupId }
      });

      const updatedGroup = await Group.findOne({
        where: {
          id: groupId,
        },
      });

      await GroupHasRole.destroy({
        where: {
          group_id: groupId
        }
      });

      for(let i = 0 ; i < role_id.length; i++)
      {
        await GroupHasRole.create({
          group_id: groupId,
          role_id: role_id[i]
        })
      }


      return res.json({
        message: 'Group updated',
        data: updatedGroup,
        error: false,
      });
    } catch (error) {
      console.error('Error in group update:', error);

      return res.status(500).json({
        message: 'Error in group update',
        error: true,
      });
    }
  },
];


const getGroupList = (async (req,res) => {
  try {

    const {filter} = req.query;

    let where = {};

    if (filter) {
      where.name = { [Op.like]: `%${filter}%` };
      
    }

    const groups = await Group.findAll({
      where,
      order:[
        ['name','ASC']
      ]
    });
    
 
    return res.json({
      "data": groups,
      "error": false
    });
    
  } catch (error) {
    console.log(error)
    return res.json({
      "message": "Data not found",
      "error": true
    });
  }
});


module.exports = {
    getAllGroup,
    storeGroup,
    updateGroup,
    getGroupList
}