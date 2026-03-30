const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const { protect } = require('../middleware/auth')

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { email, password } = req.body
  const adminEmail    = process.env.ADMIN_EMAIL    || 'admin@mirascarrental.com'
  const adminPassword = process.env.ADMIN_PASSWORD || 'Miras@2024'

  if (email !== adminEmail || password !== adminPassword) {
    return res.status(401).json({ success: false, error: 'Invalid email or password' })
  }

  const token = jwt.sign(
    { id: 'admin', email: adminEmail, role: 'admin' },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '30d' }
  )

  res.json({
    success: true,
    token,
    admin: { email: adminEmail, name: 'Admin', role: 'admin' }
  })
})

// GET /api/auth/me  (verify token)
router.get('/me', protect, (req, res) => {
  res.json({ success: true, admin: req.admin })
})

module.exports = router
