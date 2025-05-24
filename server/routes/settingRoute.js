const express = require('express')
const router = express.Router()
const {getSetting,updateSetting} = require("../controllers/SettingController");
const {tokenVerifyMiddeware} = require("../middeware/TokenVerifyMiddleware");

router.get('/',tokenVerifyMiddeware,getSetting);
router.put('/',tokenVerifyMiddeware,updateSetting);

module.exports = router