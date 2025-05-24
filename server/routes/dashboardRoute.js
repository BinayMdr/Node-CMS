const express = require('express')
const router = express.Router()
const {dashboardDetails} = require("../controllers/DashboardController");
const {tokenVerifyMiddeware} = require("../middeware/TokenVerifyMiddleware");

router.get('/details',tokenVerifyMiddeware,dashboardDetails);

module.exports = router