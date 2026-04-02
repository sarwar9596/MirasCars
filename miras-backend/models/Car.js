const mongoose = require('mongoose')

const CarSchema = new mongoose.Schema({
  name:            { type: String, required: true, trim: true },
  slug:            { type: String, required: true, unique: true },
  category:        { type: String, enum: ['Hatchback','Sedan','SUV','Motorbike'], required: true },
  images:          [{ type: String }],
  pricePerDay:     { type: Number, required: true },
  pricePerWeek:    { type: Number },
  pricePerMonth:   { type: Number },
  seats:           { type: Number, required: true },
  fuelType:        { type: String, enum: ['Petrol','Diesel','CNG','Electric'], required: true },
  transmission:    { type: String, enum: ['Manual','Automatic'], required: true },
  mileage:         { type: String },          // e.g. "18 kmpl"
  color:           { type: String },          // e.g. "Pearl White"
  modelYear:       { type: Number },
  lastServiceDate: { type: Date },
  features:        [{ type: String }],        // ['AC','Bluetooth','USB',...]
  description:     { type: String },
  isAvailable:     { type: Boolean, default: true },
  isFeatured:      { type: Boolean, default: false },
  order:           { type: Number, default: 0 },
  // Tracks the current active booking on this car
  currentBooking: {
    bookingId:     { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
    status:        { type: String, enum: ['confirmed', 'ongoing'] },
    pickupDate:    { type: Date },
    dropoffDate:   { type: Date },
  },
  totalBookings:   { type: Number, default: 0 },
}, { timestamps: true })

module.exports = mongoose.model('Car', CarSchema)
