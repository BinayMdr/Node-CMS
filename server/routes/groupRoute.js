const express = require('express')
const router = express.Router()
const {getAllGroup,storeGroup,updateGroup,getGroupList} = require("../controllers/GroupController");
const {tokenVerifyMiddeware} = require("../middeware/TokenVerifyMiddleware");

router.get('/',tokenVerifyMiddeware,getAllGroup);
router.post('/',tokenVerifyMiddeware,storeGroup);
router.put('/edit/:groupId',tokenVerifyMiddeware,updateGroup);
router.get('/get-list',tokenVerifyMiddeware,getGroupList);

module.exports = router