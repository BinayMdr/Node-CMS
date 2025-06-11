const express = require('express')
const router = express.Router()
const {getAllExpenditure,storeExpenditure} = require("../controllers/ExpenditureController");
const {tokenVerifyMiddeware} = require("../middeware/TokenVerifyMiddleware");

router.get('/',tokenVerifyMiddeware,getAllExpenditure);
router.post('/',tokenVerifyMiddeware,storeExpenditure);

module.exports = router