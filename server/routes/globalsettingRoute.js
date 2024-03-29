const express = require('express')
const router = express.Router()
const {getAllGlobalSetting,updateGlobalSetting} = require("../controllers/GlobalSettingController");
const {tokenVerifyMiddeware} = require("../middeware/TokenVerifyMiddleware");

router.get('/',getAllGlobalSetting);
router.put('/',tokenVerifyMiddeware,updateGlobalSetting);

module.exports = router