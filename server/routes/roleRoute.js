const express = require('express')
const router = express.Router()
const {getAllRole} = require("../controllers/RoleController");
const {tokenVerifyMiddeware} = require("../middeware/TokenVerifyMiddleware");

router.get('/',tokenVerifyMiddeware,getAllRole);

module.exports = router