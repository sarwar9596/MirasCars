const mongoose = require('mongoose')

const InquirySchema = new mongoose.Schema({
  name:          { type: String, required: true },
  phone:         { type: String, required: true },
  email:         { type: String },
  carId:         { type: mongoose.Schema.Types.ObjectId, ref: 'Car' },
  carName:       { type: String },
  pickupDate:    { type: Date },
  dropoffDate:   { type: Date },
  message:       { type: String },
  status:        { type: String, enum: ['New','Contacted','Confirmed','Completed','Cancelled'], default: 'New' },
  internalNotes: { type: String },
  source:        { type: String, enum: ['contact','car-page','booking'], default: 'contact' },
  isRead:        { type: Boolean, default: false },
}, { timestamps: true })

module.exports = mongoose.model('Inquiry', InquirySchema)
