const express = require('express')
const router = express.Router()
const {getAboutUs,updateAboutUs} = require("../controllers/AboutUsPageController");
const {tokenVerifyMiddeware} = require("../middeware/TokenVerifyMiddleware");

router.get('/',tokenVerifyMiddeware,getAboutUs);
router.put('/',tokenVerifyMiddeware,updateAboutUs);

module.exports = router