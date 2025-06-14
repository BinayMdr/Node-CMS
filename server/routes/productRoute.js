const express = require('express')
const router = express.Router()
const {getAllProduct,storeProduct,updateProduct,getProduct,getProductList,getProductVariationFromBranch,getProductFromBranch,getProductVariation} = require("../controllers/ProductController");
const {tokenVerifyMiddeware} = require("../middeware/TokenVerifyMiddleware");

router.get('/',tokenVerifyMiddeware,getAllProduct);
router.post('/',tokenVerifyMiddeware,storeProduct);
router.put('/edit/:productId',tokenVerifyMiddeware,updateProduct);
router.get('/get-list',tokenVerifyMiddeware,getProductList);
router.get('/branch/:branchId',tokenVerifyMiddeware,getProductFromBranch)
router.get('/get-variation/:productId/branch/:branchId',tokenVerifyMiddeware,getProductVariationFromBranch)
router.get('/get-variation/:productId',tokenVerifyMiddeware,getProductVariation)
router.get('/:productId',tokenVerifyMiddeware,getProduct);

module.exports = router