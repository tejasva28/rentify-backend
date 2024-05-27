const express = require('express');
const { createProperty, getAllProperties } = require('../controllers/propertyControllers');
const authenticateToken = require('../middleware/authenticationToken');
const multer = require('multer');
const path = require('path');
const router = express.Router();

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Add property listing
router.post('/', authenticateToken, upload.single('image'), createProperty);

// Fetch property listings
router.get('/', getAllProperties);

module.exports = router;
