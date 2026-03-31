const mongoose = require('mongoose')

const BookingSchema = new mongoose.Schema({
  customerName:  { type: String, required: true },
  phone:        { type: String, required: true },
  email:        { type: String },
  carId:        { type: mongoose.Schema.Types.ObjectId, ref: 'Car' },
  carName:      { type: String },
  pickupDate:   { type: Date, required: true },
  dropoffDate:  { type: Date, required: true },
  pickupLocation: { type: String },
  dropoffLocation: { type: String },
  totalDays:    { type: Number },
  totalPrice:   { type: Number },
  status:       { type: String, enum: ['pending','confirmed','ongoing','completed','cancelled'], default: 'pending' },
  paymentStatus:{ type: String, enum: ['unpaid','partial','paid'], default: 'unpaid' },
  notes:        { type: String },
}, { timestamps: true })

module.exports = mongoose.model('Booking', BookingSchema)
