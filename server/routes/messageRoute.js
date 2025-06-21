const express = require('express')
const router = express.Router()
const {getAllMessage} = require("../controllers/MessageController");
const {tokenVerifyMiddeware} = require("../middeware/TokenVerifyMiddleware");

router.get('/',tokenVerifyMiddeware,getAllMessage);

module.exports = router