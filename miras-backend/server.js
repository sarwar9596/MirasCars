require('dotenv').config()
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const connectDB = require('./config/db')

const app = express()

// Connect Database
connectDB()

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5173'],
  credentials: true
}))
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))
app.use(morgan('dev'))

// Routes
app.use('/api/auth',         require('./routes/auth'))
app.use('/api/cars',         require('./routes/cars'))
app.use('/api/inquiries',    require('./routes/inquiries'))
app.use('/api/blog',         require('./routes/blog'))
app.use('/api/testimonials', require('./routes/testimonials'))
app.use('/api/settings',     require('./routes/settings'))
app.use('/api/upload',       require('./routes/upload'))
app.use('/api/analytics',    require('./routes/analytics'))

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Miras Car Rental API running', time: new Date() })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: `Route ${req.originalUrl} not found` })
})

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ success: false, error: err.message || 'Server Error' })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`\n🚀 Miras Backend running on http://localhost:${PORT}`)
  console.log(`📊 Health: http://localhost:${PORT}/api/health`)
  console.log(`\nAdmin credentials: admin@mirascarrental.com / Miras@2024\n`)
})
