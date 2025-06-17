const express = require('express')
const router = express.Router()
const {getAllCustomer,storeCustomer,updateCustomer,getCustomer,getCustomerList,updatePassword} = require("../controllers/CustomerController");
const {tokenVerifyMiddeware} = require("../middeware/TokenVerifyMiddleware");

router.get('/',tokenVerifyMiddeware,getAllCustomer);
router.post('/',tokenVerifyMiddeware,storeCustomer);
router.put('/edit/:customerId',tokenVerifyMiddeware,updateCustomer);
router.get('/get-list',tokenVerifyMiddeware,getCustomerList);
router.get('/:customerId',tokenVerifyMiddeware,getCustomer);

module.exports = router