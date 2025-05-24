const express = require('express')
const router = express.Router()
const {verifyUserLogin,verifyToken,userDetails} = require("../controllers/AuthenticateController");
const {tokenVerifyMiddeware} = require("../middeware/TokenVerifyMiddleware");

router.post('/login',verifyUserLogin);
router.get('/verify-token',tokenVerifyMiddeware,verifyToken);
router.get('/userDetails',tokenVerifyMiddeware,userDetails);
module.exports = router