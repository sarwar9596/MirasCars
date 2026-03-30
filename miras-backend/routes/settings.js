const express      = require('express')
const router       = express.Router()
const SiteSettings = require('../models/SiteSettings')
const { protect }  = require('../middleware/auth')

router.get('/', async (req, res) => {
  try {
    let settings = await SiteSettings.findOne()
    if (!settings) settings = await SiteSettings.create({})
    res.json({ success: true, data: settings })
  } catch (err) { res.status(500).json({ success: false, error: err.message }) }
})

router.put('/', protect, async (req, res) => {
  try {
    let settings = await SiteSettings.findOne()
    if (!settings) {
      settings = await SiteSettings.create(req.body)
    } else {
      settings = await SiteSettings.findByIdAndUpdate(settings._id, req.body, { new: true })
    }
    res.json({ success: true, data: settings })
  } catch (err) { res.status(400).json({ success: false, error: err.message }) }
})

module.exports = router
