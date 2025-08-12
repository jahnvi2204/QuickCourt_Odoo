const express = require('express');
const { auth } = require('../middleware/auth');
const upload = require('../middleware/upload');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');

const router = express.Router();
console.log('[ROUTE] /api/upload loaded');

router.post('/image', auth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'quickcourt',
      transformation: [{ quality: 'auto', fetch_format: 'auto' }]
    });
    fs.unlinkSync(req.file.path);
    res.json({ url: result.secure_url, public_id: result.public_id });
  } catch (error) {
    res.status(500).json({ message: 'Upload failed', error: error.message });
  }
});

module.exports = router;


