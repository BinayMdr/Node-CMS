const express = require('express')
const router = express.Router()
const {getAllCustomerReview,storeCustomerReview,updateCustomerReview} = require("../controllers/CustomerReviewController");
const {tokenVerifyMiddeware} = require("../middeware/TokenVerifyMiddleware");

router.get('/',tokenVerifyMiddeware,getAllCustomerReview);
router.post('/',tokenVerifyMiddeware,storeCustomerReview);
router.put('/edit/:customerReviewId',tokenVerifyMiddeware,updateCustomerReview);

module.exports = router