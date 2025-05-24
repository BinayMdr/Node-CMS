const express = require('express')
const router = express.Router()
const {getAllUser,storeUser,updateUser,getUser,getUserList,updatePassword} = require("../controllers/UserController");
const {tokenVerifyMiddeware} = require("../middeware/TokenVerifyMiddleware");

router.get('/',tokenVerifyMiddeware,getAllUser);
router.post('/',tokenVerifyMiddeware,storeUser);
router.put('/edit/:userId',tokenVerifyMiddeware,updateUser);
router.get('/get-list',tokenVerifyMiddeware,getUserList);
router.put('/update-password',tokenVerifyMiddeware,updatePassword);
router.get('/:userId',tokenVerifyMiddeware,getUser);

module.exports = router