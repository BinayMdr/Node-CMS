const express = require('express')
const router = express.Router()
const {sendResetLink,verifyToken,changePassword} = require("../controllers/ResetPasswordController");

router.post('/',sendResetLink);
router.get('/verify-token/:token',verifyToken);
router.post('/change-password/:token',changePassword);

module.exports = router