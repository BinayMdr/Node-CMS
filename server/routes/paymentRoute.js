const express = require('express')
const router = express.Router()
const {getAllPayment,storePayment,updatePayment,getPayment,getPaymentList} = require("../controllers/PaymentController");
const {tokenVerifyMiddeware} = require("../middeware/TokenVerifyMiddleware");

router.get('/',tokenVerifyMiddeware,getAllPayment);
router.post('/',tokenVerifyMiddeware,storePayment);
router.put('/edit/:paymentId',tokenVerifyMiddeware,updatePayment);
router.get('/get-list',tokenVerifyMiddeware,getPaymentList);
router.get('/:paymentId',tokenVerifyMiddeware,getPayment);

module.exports = router