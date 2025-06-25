const express = require('express')
const router = express.Router()
const {getAllBanner,storeBanner,updateBanner,updateBannerOrder} = require("../controllers/BannerContoller");
const {tokenVerifyMiddeware} = require("../middeware/TokenVerifyMiddleware");

router.get('/',tokenVerifyMiddeware,getAllBanner);
router.post('/',tokenVerifyMiddeware,storeBanner);
router.put('/edit/:bannerId',tokenVerifyMiddeware,updateBanner);
router.put('/reorder',tokenVerifyMiddeware,updateBannerOrder);

module.exports = router