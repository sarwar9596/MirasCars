const express = require('express')
const router  = express.Router()
const slugify = require('slugify')
const Car     = require('../models/Car')
const { protect } = require('../middleware/auth')

// GET /api/cars  (public)
router.get('/', async (req, res) => {
  try {
    const { category, featured, available } = req.query
    let query = {}
    if (category && category !== 'All') query.category = category
    if (featured  === 'true') query.isFeatured  = true
    if (available === 'true') query.isAvailable = true

    const cars = await Car.find(query).sort({ order: 1, createdAt: -1 })
    res.json({ success: true, count: cars.length, data: cars })
  } catch (err) { res.status(500).json({ success: false, error: err.message }) }
})

// GET /api/cars/:id  (public – by id OR slug)
router.get('/:id', async (req, res) => {
  try {
    const car = await Car.findOne({
      $or: [{ slug: req.params.id }, ...(req.params.id.match(/^[a-f\d]{24}$/i) ? [{ _id: req.params.id }] : [])]
    })
    if (!car) return res.status(404).json({ success: false, error: 'Car not found' })
    res.json({ success: true, data: car })
  } catch (err) { res.status(500).json({ success: false, error: err.message }) }
})

// POST /api/cars  (admin)
router.post('/', protect, async (req, res) => {
  try {
    const base = slugify(req.body.name, { lower: true, strict: true })
    req.body.slug = base + '-' + Date.now()
    // Map admin panel's status field to isAvailable boolean
    if (req.body.status) {
      req.body.isAvailable = req.body.status === 'available'
      delete req.body.status
    }
    const car = await Car.create(req.body)
    res.status(201).json({ success: true, data: car })
  } catch (err) { res.status(400).json({ success: false, error: err.message }) }
})

// PUT /api/cars/:id  (admin)
router.put('/:id', protect, async (req, res) => {
  try {
    if (req.body.status) {
      req.body.isAvailable = req.body.status === 'available'
      delete req.body.status
    }
    const car = await Car.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!car) return res.status(404).json({ success: false, error: 'Car not found' })
    res.json({ success: true, data: car })
  } catch (err) { res.status(400).json({ success: false, error: err.message }) }
})

// DELETE /api/cars/:id  (admin)
router.delete('/:id', protect, async (req, res) => {
  try {
    const car = await Car.findByIdAndDelete(req.params.id)
    if (!car) return res.status(404).json({ success: false, error: 'Car not found' })
    res.json({ success: true, message: 'Car deleted successfully' })
  } catch (err) { res.status(500).json({ success: false, error: err.message }) }
})

module.exports = router
