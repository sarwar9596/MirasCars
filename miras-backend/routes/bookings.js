const express  = require('express')
const router   = express.Router()
const Booking  = require('../models/Booking')
const { protect } = require('../middleware/auth')

// GET /api/bookings  (admin)
router.get('/', protect, async (req, res) => {
  try {
    const { status, limit = 100 } = req.query
    let query = {}
    if (status && status !== 'all') query.status = status
    const bookings = await Booking.find(query).sort({ createdAt: -1 }).limit(Number(limit))
    res.json({ success: true, count: bookings.length, data: bookings })
  } catch (err) { res.status(500).json({ success: false, error: err.message }) }
})

// GET /api/bookings/:id  (admin)
router.get('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
    if (!booking) return res.status(404).json({ success: false, error: 'Booking not found' })
    res.json({ success: true, data: booking })
  } catch (err) { res.status(500).json({ success: false, error: err.message }) }
})

// POST /api/bookings  (public – from website)
router.post('/', async (req, res) => {
  try {
    const booking = await Booking.create(req.body)
    res.status(201).json({ success: true, data: booking })
  } catch (err) { res.status(400).json({ success: false, error: err.message }) }
})

// PUT /api/bookings/:id  (admin)
router.put('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!booking) return res.status(404).json({ success: false, error: 'Booking not found' })
    res.json({ success: true, data: booking })
  } catch (err) { res.status(400).json({ success: false, error: err.message }) }
})

// PATCH /api/bookings/:id/status  (admin)
router.patch('/:id/status', protect, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true })
    if (!booking) return res.status(404).json({ success: false, error: 'Booking not found' })
    res.json({ success: true, data: booking })
  } catch (err) { res.status(400).json({ success: false, error: err.message }) }
})

// DELETE /api/bookings/:id  (admin)
router.delete('/:id', protect, async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id)
    res.json({ success: true, message: 'Booking deleted' })
  } catch (err) { res.status(500).json({ success: false, error: err.message }) }
})

module.exports = router
