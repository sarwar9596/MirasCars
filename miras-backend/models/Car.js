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
  modelYear:       { type: Number },
  lastServiceDate: { type: Date },
  features:        [{ type: String }],        // ['AC','Bluetooth','USB',...]
  description:     { type: String },
  isAvailable:     { type: Boolean, default: true },
  isFeatured:      { type: Boolean, default: false },
  order:           { type: Number, default: 0 },
  bookedUntil:     { type: Date, default: null },  // Car booked until this date
  totalBookings:   { type: Number, default: 0 },
}, { timestamps: true })

module.exports = mongoose.model('Car', CarSchema)
