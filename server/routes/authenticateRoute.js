const express = require('express')
const router = express.Router()
const {verifyUserLogin,verifyToken} = require("../controllers/AuthenticateController");
const {tokenVerifyMiddeware} = require("../middeware/TokenVerifyMiddleware");

router.post('/login',verifyUserLogin);
router.get('/verify-token',tokenVerifyMiddeware,verifyToken);
module.exports = router