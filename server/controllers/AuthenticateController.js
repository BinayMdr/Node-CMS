const user = require('../models/user');
const branch = require('../models/branch');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require("dotenv").config();
const { body, validationResult } = require('express-validator');

const verifyUserLogin =[  
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').notEmpty().withMessage('Password is required'),
( async (req,res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    
    const userData = await user.findOne({ where: { email } });

    if ( userData == null) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if ( !userData.is_active) {
        return res.status(401).json({ message: 'User cannot login the system' });
    }

    const match = await bcrypt.compare(password, userData['password']);

    if(!match)
    {
        return res.status(401).json({"message":"Invalid credentials","error":true})
    }

    const token = jwt.sign({ email: email, id: userData['dataValues']['id'],branch_id:userData['dataValues']['branch_id'] }, process.env.JWT_SECRET, { expiresIn: '4h' });
    return res.json({ "token":token, "error":false });
})];

const verifyToken = (async(req,res) => {
    return res.json({"message": "Valid Token","error":false})
});

const userDetails = (async(req,res) => {
    const decoded = req.decodedData;

    const userData = await user.findByPk(decoded.id, {
        attributes: ['id', 'name', 'email','branch_id','is_admin'],
      });
    
    
    let branchData = null;

    if(userData.branch_id != null)
    {
        branchData = await branch.findByPk(userData.branch_id,{
           attributes:['id','name']
        });
    }

    let data = [];

    data = { 'user': userData ,
         'branch': branchData };
  
    return res.json({'data':data,'error':false});
});
module.exports = {
    verifyUserLogin,verifyToken,userDetails
}