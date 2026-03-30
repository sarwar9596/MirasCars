const mongoose = require('mongoose')

const TestimonialSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  city:         { type: String },
  rating:       { type: Number, min: 1, max: 5, default: 5 },
  reviewText:   { type: String, required: true },
  isVisible:    { type: Boolean, default: true },
}, { timestamps: true })

module.exports = mongoose.model('Testimonial', TestimonialSchema)
