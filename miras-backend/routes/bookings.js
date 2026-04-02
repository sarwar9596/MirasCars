const express  = require('express')
const router   = express.Router()
const Booking  = require('../models/Booking')
const Car      = require('../models/Car')
const { protect } = require('../middleware/auth')

// ── Helpers ────────────────────────────────────────────────────────────────────
async function syncCarBooking(carId, booking, status) {
  if (!carId) return
  if (status === 'confirmed' || status === 'ongoing') {
    await Car.findByIdAndUpdate(carId, {
      isAvailable: false,
      currentBooking: {
        bookingId: booking._id,
        status,
        pickupDate: booking.pickupDate || null,
        dropoffDate: booking.dropoffDate || null,
      },
    })
  } else {
    // closed, completed, cancelled → restore car
    await Car.findByIdAndUpdate(carId, {
      isAvailable: true,
      currentBooking: null,
    })
  }
}

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

// POST /api/bookings  (public – from website or admin)
router.post('/', async (req, res) => {
  try {
    // Force confirmed so cron picks it up; admin can later change status
    const body = { ...req.body }
    if (!body.status || body.status === 'pending') body.status = 'confirmed'
    const booking = await Booking.create(body)

    if (booking.carId) {
      await Car.findByIdAndUpdate(booking.carId, { $inc: { totalBookings: 1 } })
      await syncCarBooking(booking.carId, booking, 'confirmed')
    }

    const settings = await require('../models/SiteSettings').findOne().lean()
    const wa = settings?.whatsapp || process.env.WHATSAPP_NUMBER || '919103489268'
    const days = booking.pickupDate && booking.dropoffDate
      ? Math.ceil((new Date(booking.dropoffDate) - new Date(booking.pickupDate)) / 86400000)
      : null
    const msgLines = [
      '🚗 *New Booking – Miras Car Rental*',
      '',
      `👤 *Name:* ${booking.customerName || booking.name}`,
      `📞 *Phone:* ${booking.phone}`,
      booking.email ? `📧 *Email:* ${booking.email}` : null,
      booking.carName ? `🚘 *Car:* ${booking.carName}` : null,
      booking.pickupDate  ? `📅 *Pickup:*  ${new Date(booking.pickupDate).toDateString()}`  : null,
      booking.dropoffDate ? `📅 *Return:*  ${new Date(booking.dropoffDate).toDateString()}` : null,
      days ? `⏱️  *Duration:* ${days} day${days > 1 ? 's' : ''}` : null,
      booking.totalPrice ? `💰 *Total:* ₹${Number(booking.totalPrice).toLocaleString()}` : null,
      booking.notes ? `💬 *Notes:* ${booking.notes}` : null,
      '',
      '_Booking confirmed — contact customer to arrange delivery._'
    ].filter(Boolean).join('\n')

    const whatsappUrl = `https://wa.me/${wa}?text=${encodeURIComponent(msgLines)}`
    res.status(201).json({ success: true, data: booking, whatsappUrl })
  } catch (err) { res.status(400).json({ success: false, error: err.message }) }
})

// PUT /api/bookings/:id  (admin – full update)
router.put('/:id', protect, async (req, res) => {
  try {
    const old = await Booking.findById(req.params.id)
    const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!booking) return res.status(404).json({ success: false, error: 'Booking not found' })
    // Sync car if status or carId changed
    if (old.carId) await syncCarBooking(old.carId, booking, req.body.status || booking.status)
    res.json({ success: true, data: booking })
  } catch (err) { res.status(400).json({ success: false, error: err.message }) }
})

// PATCH /api/bookings/:id/status  (admin)
router.patch('/:id/status', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
    if (!booking) return res.status(404).json({ success: false, error: 'Booking not found' })
    const newStatus = req.body.status
    booking.status = newStatus
    await booking.save()
    await syncCarBooking(booking.carId, booking, newStatus)
    res.json({ success: true, data: booking })
  } catch (err) { res.status(500).json({ success: false, error: err.message }) }
})

// DELETE /api/bookings/:id  (admin)
router.delete('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
    if (booking?.carId) await syncCarBooking(booking.carId, { carId: booking.carId }, 'cancelled')
    await Booking.findByIdAndDelete(req.params.id)
    res.json({ success: true, message: 'Booking deleted' })
  } catch (err) { res.status(500).json({ success: false, error: err.message }) }
})

module.exports = router
