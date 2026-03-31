const express  = require('express')
const router   = express.Router()
const Inquiry  = require('../models/Inquiry')
const Car      = require('../models/Car')
const { protect } = require('../middleware/auth')

// GET /api/inquiries  (admin)
router.get('/', protect, async (req, res) => {
  try {
    const { status, limit = 100 } = req.query
    let query = {}
    if (status) query.status = status
    const inquiries = await Inquiry.find(query).sort({ createdAt: -1 }).limit(Number(limit))
    const unread    = await Inquiry.countDocuments({ isRead: false })
    res.json({ success: true, count: inquiries.length, unread, data: inquiries })
  } catch (err) { res.status(500).json({ success: false, error: err.message }) }
})

// POST /api/inquiries  (public – from website forms)
router.post('/', async (req, res) => {
  try {
    const inquiry = await Inquiry.create(req.body)

    // If this is a booking, increment car's totalBookings
    if (req.body.carId) {
      await Car.findByIdAndUpdate(req.body.carId, { $inc: { totalBookings: 1 } })
    }

    // Build WhatsApp notification message
    const wa   = process.env.WHATSAPP_NUMBER || '919876543210'
    const days = req.body.pickupDate && req.body.dropoffDate
      ? Math.ceil((new Date(req.body.dropoffDate) - new Date(req.body.pickupDate)) / 86400000)
      : null

    const msgLines = [
      '🚗 *New Inquiry – Miras Car Rental*',
      '',
      `👤 *Name:* ${req.body.name}`,
      `📞 *Phone:* ${req.body.phone}`,
      req.body.email ? `📧 *Email:* ${req.body.email}` : null,
      req.body.carName ? `🚘 *Car:* ${req.body.carName}` : null,
      req.body.pickupDate  ? `📅 *Pickup:*  ${new Date(req.body.pickupDate).toDateString()}`  : null,
      req.body.dropoffDate ? `📅 *Return:*  ${new Date(req.body.dropoffDate).toDateString()}` : null,
      days ? `⏱️  *Duration:* ${days} day${days > 1 ? 's' : ''}` : null,
      req.body.message ? `💬 *Message:* ${req.body.message}` : null,
      '',
      '_Reply to confirm booking_'
    ].filter(Boolean).join('\n')

    const whatsappUrl = `https://wa.me/${wa}?text=${encodeURIComponent(msgLines)}`

    res.status(201).json({ success: true, data: inquiry, whatsappUrl })
  } catch (err) { res.status(400).json({ success: false, error: err.message }) }
})

// PUT /api/inquiries/:id  (admin – update status / notes)
router.put('/:id', protect, async (req, res) => {
  try {
    const inquiry = await Inquiry.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!inquiry) return res.status(404).json({ success: false, error: 'Inquiry not found' })
    res.json({ success: true, data: inquiry })
  } catch (err) { res.status(400).json({ success: false, error: err.message }) }
})

// DELETE /api/inquiries/:id  (admin)
router.delete('/:id', protect, async (req, res) => {
  try {
    await Inquiry.findByIdAndDelete(req.params.id)
    res.json({ success: true, message: 'Inquiry deleted' })
  } catch (err) { res.status(500).json({ success: false, error: err.message }) }
})

// PATCH /api/inquiries/:id/read  (admin – mark as read)
router.patch('/:id/read', protect, async (req, res) => {
  try {
    await Inquiry.findByIdAndUpdate(req.params.id, { isRead: true })
    res.json({ success: true })
  } catch (err) { res.status(500).json({ success: false, error: err.message }) }
})

// PATCH /api/inquiries/:id/status  (admin – update status)
router.patch('/:id/status', protect, async (req, res) => {
  try {
    const inquiry = await Inquiry.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status, isRead: true },
      { new: true }
    )
    if (!inquiry) return res.status(404).json({ success: false, error: 'Inquiry not found' })
    res.json({ success: true, data: inquiry })
  } catch (err) { res.status(500).json({ success: false, error: err.message }) }
})

module.exports = router
