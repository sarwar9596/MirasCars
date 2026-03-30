const express  = require('express')
const router   = express.Router()
const { protect } = require('../middleware/auth')

// POST /api/upload  (admin)
router.post('/', protect, async (req, res) => {
  try {
    // Check if Cloudinary is configured
    const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env
    if (!CLOUDINARY_CLOUD_NAME || CLOUDINARY_CLOUD_NAME === 'your_cloud_name') {
      // Return a placeholder URL for development
      const placeholders = [
        'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800',
        'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=800',
        'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800',
        'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800',
      ]
      return res.json({
        success: true,
        url: placeholders[Math.floor(Math.random() * placeholders.length)],
        note: 'Dev mode: using placeholder. Configure Cloudinary in .env for real uploads.'
      })
    }

    // Real Cloudinary upload
    const { upload } = require('../config/cloudinary')
    const multerUpload = upload.single('image')
    multerUpload(req, res, (err) => {
      if (err) return res.status(400).json({ success: false, error: err.message })
      res.json({ success: true, url: req.file.path, public_id: req.file.filename })
    })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// POST /api/upload/base64  (admin – accepts base64 image string)
router.post('/base64', protect, async (req, res) => {
  try {
    const { CLOUDINARY_CLOUD_NAME } = process.env
    if (!CLOUDINARY_CLOUD_NAME || CLOUDINARY_CLOUD_NAME === 'your_cloud_name') {
      return res.json({
        success: true,
        url: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800',
        note: 'Dev mode placeholder'
      })
    }
    const { cloudinary } = require('../config/cloudinary')
    const result = await cloudinary.uploader.upload(req.body.image, {
      folder: 'miras-car-rental',
      transformation: [{ width: 1200, height: 800, crop: 'fill', quality: 'auto' }]
    })
    res.json({ success: true, url: result.secure_url, public_id: result.public_id })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

module.exports = router
