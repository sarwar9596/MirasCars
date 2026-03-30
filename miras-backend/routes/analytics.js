const express  = require('express')
const router   = express.Router()
const Car      = require('../models/Car')
const Inquiry  = require('../models/Inquiry')
const { protect } = require('../middleware/auth')

// GET /api/analytics/dashboard  — main stats card data
router.get('/dashboard', protect, async (req, res) => {
  try {
    const totalCars      = await Car.countDocuments()
    const availableCars  = await Car.countDocuments({ isAvailable: true })
    const totalInquiries = await Inquiry.countDocuments()
    const newInquiries   = await Inquiry.countDocuments({ status: 'New' })
    const confirmed      = await Inquiry.countDocuments({ status: 'Confirmed' })
    const completed      = await Inquiry.countDocuments({ status: 'Completed' })

    // Today's new inquiries
    const todayStart = new Date(); todayStart.setHours(0,0,0,0)
    const todayInquiries = await Inquiry.countDocuments({ createdAt: { $gte: todayStart } })

    // Estimate revenue (confirmed + completed * avg price 3500/day * 3 days)
    const estimatedRevenue = (confirmed + completed) * 3500 * 3

    res.json({
      success: true,
      data: {
        totalCars, availableCars, totalInquiries, newInquiries,
        confirmed, completed, todayInquiries, estimatedRevenue
      }
    })
  } catch (err) { res.status(500).json({ success: false, error: err.message }) }
})

// GET /api/analytics/monthly  — inquiries per month (last 12 months)
router.get('/monthly', protect, async (req, res) => {
  try {
    const twelveMonthsAgo = new Date()
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11)
    twelveMonthsAgo.setDate(1); twelveMonthsAgo.setHours(0,0,0,0)

    const data = await Inquiry.aggregate([
      { $match: { createdAt: { $gte: twelveMonthsAgo } } },
      {
        $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          total:     { $sum: 1 },
          confirmed: { $sum: { $cond: [{ $in: ['$status', ['Confirmed','Completed']] }, 1, 0] } },
          cancelled: { $sum: { $cond: [{ $eq: ['$status', 'Cancelled'] }, 1, 0] } },
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ])

    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    const result = data.map(d => ({
      month: `${months[d._id.month - 1]} ${d._id.year}`,
      total: d.total, confirmed: d.confirmed, cancelled: d.cancelled
    }))

    res.json({ success: true, data: result })
  } catch (err) { res.status(500).json({ success: false, error: err.message }) }
})

// GET /api/analytics/top-cars  — most booked cars
router.get('/top-cars', protect, async (req, res) => {
  try {
    const cars = await Car.find().sort({ totalBookings: -1 }).limit(8)
      .select('name category totalBookings pricePerDay isAvailable images')
    res.json({ success: true, data: cars })
  } catch (err) { res.status(500).json({ success: false, error: err.message }) }
})

// GET /api/analytics/status-breakdown  — inquiry status pie
router.get('/status-breakdown', protect, async (req, res) => {
  try {
    const data = await Inquiry.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ])
    res.json({ success: true, data: data.map(d => ({ status: d._id, count: d.count })) })
  } catch (err) { res.status(500).json({ success: false, error: err.message }) }
})

// GET /api/analytics/category-breakdown  — bookings by car category
router.get('/category-breakdown', protect, async (req, res) => {
  try {
    const data = await Inquiry.aggregate([
      { $match: { carName: { $exists: true, $ne: null } } },
      {
        $lookup: {
          from: 'cars', localField: 'carId', foreignField: '_id', as: 'car'
        }
      },
      { $unwind: { path: '$car', preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: '$car.category',
          count: { $sum: 1 }
        }
      },
      { $match: { _id: { $ne: null } } }
    ])

    // Fallback: count by car category from cars collection
    if (data.length === 0) {
      const cats = await Car.aggregate([
        { $group: { _id: '$category', count: { $sum: '$totalBookings' } } }
      ])
      return res.json({ success: true, data: cats.map(c => ({ category: c._id, count: c.count })) })
    }

    res.json({ success: true, data: data.map(d => ({ category: d._id || 'Unknown', count: d.count })) })
  } catch (err) { res.status(500).json({ success: false, error: err.message }) }
})

// GET /api/analytics/recent  — recent 5 inquiries
router.get('/recent', protect, async (req, res) => {
  try {
    const recent = await Inquiry.find().sort({ createdAt: -1 }).limit(5)
    res.json({ success: true, data: recent })
  } catch (err) { res.status(500).json({ success: false, error: err.message }) }
})

module.exports = router
