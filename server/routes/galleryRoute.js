const express = require('express')
const router = express.Router()
const {getGalleryFiles,uploadGalleryFile,deleteGalleryFile,renameGalleryFile,reorderGalleryFile} = require("../controllers/GalleryController");
const {tokenVerifyMiddeware} = require("../middeware/TokenVerifyMiddleware");

router.get('/',tokenVerifyMiddeware,getGalleryFiles);
router.post('/', tokenVerifyMiddeware, uploadGalleryFile);
router.put('/re-order', tokenVerifyMiddeware, reorderGalleryFile);
router.delete('/:galleryId',tokenVerifyMiddeware,deleteGalleryFile);
router.put('/rename/:galleryId',tokenVerifyMiddeware,renameGalleryFile);

module.exports = router