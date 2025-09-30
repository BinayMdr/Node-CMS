const express = require('express')
const router = express.Router()
const {getHomePage,updateHomePage} = require("../controllers/HomePageController");
const {tokenVerifyMiddeware} = require("../middeware/TokenVerifyMiddleware");

router.get('/',tokenVerifyMiddeware,getHomePage);
router.put('/',tokenVerifyMiddeware,updateHomePage);

module.exports = router