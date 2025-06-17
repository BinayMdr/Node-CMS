const express = require('express')
const router = express.Router()
const {getAllOffer,storeOffer,updateOffer,getOffer,checkOffer} = require("../controllers/OfferController");
const {tokenVerifyMiddeware} = require("../middeware/TokenVerifyMiddleware");

router.get('/',tokenVerifyMiddeware,getAllOffer);
router.post('/',tokenVerifyMiddeware,storeOffer);
router.put('/edit/:offerId',tokenVerifyMiddeware,updateOffer);
router.get('/check/:branchId',tokenVerifyMiddeware,checkOffer)
router.get('/:offerId',tokenVerifyMiddeware,getOffer);

module.exports = router