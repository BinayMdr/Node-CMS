const express = require('express')
const router = express.Router()
const {getAllFoodCategory,storeFoodCategory,updateFoodCategory,updateFoodCategoryOrder} = require("../controllers/FoodCategoryController");
const {tokenVerifyMiddeware} = require("../middeware/TokenVerifyMiddleware");

router.get('/',tokenVerifyMiddeware,getAllFoodCategory);
router.post('/',tokenVerifyMiddeware,storeFoodCategory);
router.put('/edit/:foodCategoryId',tokenVerifyMiddeware,updateFoodCategory);
router.put('/reorder',tokenVerifyMiddeware,updateFoodCategoryOrder);

module.exports = router