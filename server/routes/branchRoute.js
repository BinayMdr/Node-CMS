const express = require('express')
const router = express.Router()
const {getAllBranch,storeBranch,updateBranch,getBranch,getBranchList} = require("../controllers/BranchController");
const {tokenVerifyMiddeware} = require("../middeware/TokenVerifyMiddleware");

router.get('/',tokenVerifyMiddeware,getAllBranch);
router.post('/',tokenVerifyMiddeware,storeBranch);
router.put('/edit/:branchId',tokenVerifyMiddeware,updateBranch);
router.get('/get-list',tokenVerifyMiddeware,getBranchList);
router.get('/:branchId',tokenVerifyMiddeware,getBranch);

module.exports = router