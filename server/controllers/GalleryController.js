const path = require('path');
const fs = require('fs');
const { validationResult } = require('express-validator');
const gallery = require('../models/gallery')
const GALLERY_PATH = path.join(process.cwd(), 'uploads/gallery');

const getGalleryFiles = async (req, res) => {
  try {
    const files = await gallery.findAll({
      order:[['order','ASC']]
    })

    return res.json({ data: files, error: false });
  } catch (error) {
    console.error('Error listing gallery files:', error);
    return res.status(500).json({ message: 'Failed to read gallery', error: true });
  }
};

const uploadGalleryFile = async (req, res) => {
   if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'No files uploaded', error: true });
  }

  
  const uploadedFiles = [];

  let maxOrder = await gallery.max('order')
  if(maxOrder == null) maxOrder = 0

  try {
    for (const f of req.files) {
      maxOrder = maxOrder + 1
      const nameWithoutExt = path.parse(f.filename).name;
      const fileData = {
        name: nameWithoutExt,
        image: `/gallery/${f.filename}`,
        order: maxOrder
      };

      await gallery.create(fileData); 

      uploadedFiles.push(fileData);
    }

    return res.json({
      message: 'Files uploaded',
      files: uploadedFiles,
      error: false,
    });
  } catch (err) {
    console.error('DB save error:', err);
    return res.status(500).json({ message: 'Upload succeeded but DB save failed', error: true });
  }

};

const deleteGalleryFile = async (req, res) => {

  const galleryId = req.params.galleryId;

  const galleryData = await gallery.findOne({
    where:{
      id: galleryId
    }
  }) 
  const filePath = path.join(process.cwd(), 'uploads',  galleryData.dataValues.image);
 
  await galleryData.destroy()

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: 'File not found', error: true });
  }

  fs.unlinkSync(filePath);
  return res.json({ message: 'File deleted', error: false });
};

const renameGalleryFile = async(req, res) => {
  const galleryId = req.params.galleryId;

  const {name} = req.body

  await gallery.update(
      { name },
      {
        where: { id: galleryId },
      }
  );

  return res.json({
    message: 'File renamed',
    error: false
  });
};

const reorderGalleryFile = async(req, res) => {

  const {files} = req.body

  for(let i = 0 ; i< files.length ; i++)
  {
    await gallery.update(
      { order: i + 1 },
      {
        where: { id: files[i]['id'] },
      }
    );
  }
 
  return res.json({
    message: 'File reordered',
    error: false
  });
};

module.exports = {
  getGalleryFiles,
  uploadGalleryFile,
  deleteGalleryFile,
  renameGalleryFile,
  reorderGalleryFile
};
