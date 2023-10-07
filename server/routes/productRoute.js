const express = require('express')
const router = express.Router()
const {getAllProduct,storeProduct,updateProduct,getProduct,getProductList} = require("../controllers/ProductController");
const {tokenVerifyMiddeware} = require("../middeware/TokenVerifyMiddleware");

router.get('/',tokenVerifyMiddeware,getAllProduct);
router.post('/',tokenVerifyMiddeware,storeProduct);
router.put('/edit/:productId',tokenVerifyMiddeware,updateProduct);
router.get('/get-list',tokenVerifyMiddeware,getProductList);
router.get('/:productId',tokenVerifyMiddeware,getProduct);

module.exports = router