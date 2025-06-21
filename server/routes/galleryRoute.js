const express = require('express')
const router = express.Router()
const {getGalleryFiles,uploadGalleryFile,deleteGalleryFile,renameGalleryFile} = require("../controllers/GalleryController");
const {tokenVerifyMiddeware} = require("../middeware/TokenVerifyMiddleware");

router.get('/',tokenVerifyMiddeware,getGalleryFiles);
router.post('/',tokenVerifyMiddeware,uploadGalleryFile);
router.delete('/:fileName',tokenVerifyMiddeware,deleteGalleryFile);
router.put('/rename',tokenVerifyMiddeware,renameGalleryFile);

module.exports = router