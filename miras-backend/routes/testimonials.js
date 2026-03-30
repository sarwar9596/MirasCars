const express     = require('express')
const router      = express.Router()
const Testimonial = require('../models/Testimonial')
const { protect } = require('../middleware/auth')

router.get('/', async (req, res) => {
  try {
    const query = req.query.all === 'true' ? {} : { isVisible: true }
    const items = await Testimonial.find(query).sort({ createdAt: -1 })
    res.json({ success: true, data: items })
  } catch (err) { res.status(500).json({ success: false, error: err.message }) }
})

router.post('/', protect, async (req, res) => {
  try {
    const item = await Testimonial.create(req.body)
    res.status(201).json({ success: true, data: item })
  } catch (err) { res.status(400).json({ success: false, error: err.message }) }
})

router.put('/:id', protect, async (req, res) => {
  try {
    const item = await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json({ success: true, data: item })
  } catch (err) { res.status(400).json({ success: false, error: err.message }) }
})

router.delete('/:id', protect, async (req, res) => {
  try {
    await Testimonial.findByIdAndDelete(req.params.id)
    res.json({ success: true })
  } catch (err) { res.status(500).json({ success: false, error: err.message }) }
})

module.exports = router
