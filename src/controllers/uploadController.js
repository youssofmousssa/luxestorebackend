const cloudinary = require('cloudinary').v2;
const axios = require('axios');

cloudinary.config({
  secure: true,
  cloud_name: process.env.CLOUDINARY_URL?.split('@')[1],
  api_key: process.env.CLOUDINARY_URL?.split('//')[1]?.split(':')[0],
  api_secret: process.env.CLOUDINARY_URL?.split(':')[2]?.split('@')[0]
});

async function uploadToCloudinary(req, res, next) {
  try {
    if (!req.file) return res.status(400).json({ error: 'No image provided' });
    const result = await cloudinary.uploader.upload_stream(
      { resource_type: 'image', folder: 'luxestore' },
      (error, result) => {
        if (error) return next(error);
        res.json({ url: result.secure_url });
      }
    ).end(req.file.buffer);
  } catch (err) { next(err); }
}

async function uploadToImgbb(req, res, next) {
  try {
    if (!req.file) return res.status(400).json({ error: 'No image provided' });
    const apiKey = process.env.IMGBB_API_KEY;
    const form = new FormData();
    form.append('image', req.file.buffer.toString('base64'));
    const response = await axios.post(`https://api.imgbb.com/1/upload?key=${apiKey}`, form, {
      headers: form.getHeaders()
    });
    res.json({ url: response.data.data.url });
  } catch (err) { next(err); }
}

module.exports = { uploadToCloudinary, uploadToImgbb };
