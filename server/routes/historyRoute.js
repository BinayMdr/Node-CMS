const express = require('express')
const router = express.Router()
const {getAllHistory} = require("../controllers/HistoryController");
const {tokenVerifyMiddeware} = require("../middeware/TokenVerifyMiddleware");

router.get('/:productId',getAllHistory);

module.exports = router