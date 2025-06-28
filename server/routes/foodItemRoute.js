const express = require('express')
const router = express.Router()
const {getAllFoodItem,storeFoodItem,updateFoodItem,updateFoodItemOrder} = require("../controllers/FoodItemController");
const {tokenVerifyMiddeware} = require("../middeware/TokenVerifyMiddleware");

router.get('/',tokenVerifyMiddeware,getAllFoodItem);
router.post('/',tokenVerifyMiddeware,storeFoodItem);
router.put('/edit/:foodItemId',tokenVerifyMiddeware,updateFoodItem);
router.put('/reorder',tokenVerifyMiddeware,updateFoodItemOrder);

module.exports = router