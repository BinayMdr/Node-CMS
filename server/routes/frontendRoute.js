const express = require('express')
const router = express.Router()
const {getAboutUs,getAllGlobalSetting,getGalleryFiles,getHomePage,getBanner,getCustomerReview,getMenu} = require("../controllers/FrontendController");

router.get('/get-about-us',getAboutUs);
router.get('/get-global-setting',getAllGlobalSetting);
router.get('/get-gallery-files',getGalleryFiles);
router.get('/get-home-page',getHomePage);
router.get('/get-banner',getBanner);
router.get('/get-customer-review',getCustomerReview);
router.get('/get-menu',getMenu);

module.exports = router