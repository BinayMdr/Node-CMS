const express = require('express')
const router = express.Router()
const {getAllInvoice,storeInvoice,updateInvoice,getInvoice} = require("../controllers/InvoiceController");
const {tokenVerifyMiddeware} = require("../middeware/TokenVerifyMiddleware");

router.get('/',tokenVerifyMiddeware,getAllInvoice);
router.post('/',tokenVerifyMiddeware,storeInvoice);
router.put('/edit/:invoiceId',tokenVerifyMiddeware,updateInvoice);
router.get('/:invoiceId',tokenVerifyMiddeware,getInvoice);

module.exports = router