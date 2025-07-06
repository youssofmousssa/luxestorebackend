const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadToCloudinary, uploadToImgbb } = require('../controllers/uploadController');
const upload = multer({ storage: multer.memoryStorage() });

router.post('/cloudinary', upload.single('image'), uploadToCloudinary);
router.post('/imgbb', upload.single('image'), uploadToImgbb);

module.exports = router;
