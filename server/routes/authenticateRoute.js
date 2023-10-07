const express = require('express')
const router = express.Router()
const {verifyUserLogin} = require("../controllers/AuthenticateController");


router.post('/login',verifyUserLogin);

module.exports = router