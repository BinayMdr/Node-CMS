const path = require('path');
const fs = require('fs');
const { validationResult } = require('express-validator');

const GALLERY_PATH = path.join(process.cwd(), 'uploads/gallery');

const getGalleryFiles = (req, res) => {
  try {
    const files = fs.readdirSync(GALLERY_PATH).map((file) => ({
      name: file,
      path: `/uploads/gallery/${file}`
    }));
    return res.json({ data: files, error: false });
  } catch (error) {
    console.error('Error listing gallery files:', error);
    return res.status(500).json({ message: 'Failed to read gallery', error: true });
  }
};

const uploadGalleryFile = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded', error: true });
  }

  return res.json({
    message: 'File uploaded',
    file: {
      name: req.file.filename,
      path: `/uploads/gallery/${req.file.filename}`
    },
    error: false
  });
};

const deleteGalleryFile = (req, res) => {
  const { fileName } = req.params;
  const filePath = path.join(GALLERY_PATH, fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: 'File not found', error: true });
  }

  fs.unlinkSync(filePath);
  return res.json({ message: 'File deleted', error: false });
};

const renameGalleryFile = (req, res) => {
  const { oldName, newName } = req.body;

  const oldPath = path.join(GALLERY_PATH, oldName);
  const newPath = path.join(GALLERY_PATH, newName);

  if (!fs.existsSync(oldPath)) {
    return res.status(404).json({ message: 'Old file does not exist', error: true });
  }

  fs.renameSync(oldPath, newPath);
  return res.json({
    message: 'File renamed',
    file: {
      name: newName,
      path: `/uploads/gallery/${newName}`
    },
    error: false
  });
};

module.exports = {
  getGalleryFiles,
  uploadGalleryFile,
  deleteGalleryFile,
  renameGalleryFile
};
