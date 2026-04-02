const mongoose = require('mongoose')

const SiteSettingsSchema = new mongoose.Schema({
  phone:         { type: String, default: '+91 98765 43210' },
  whatsapp:      { type: String, default: '919103489268' },
  email:         { type: String, default: 'info@mirascarrental.com' },
  address:       { type: String, default: 'Lal Chowk, Srinagar, Kashmir - 190001' },
  socialLinks: {
    instagram:   { type: String, default: 'https://instagram.com/self_drive_car_rental_kashmir' },
    facebook:    { type: String, default: '' },
    youtube:     { type: String, default: '' },
  },
  businessHours: { type: String, default: 'Mon–Sun: 7:00 AM – 9:00 PM' },
  seoDefaults: {
    siteTitle:       { type: String, default: 'Miras Car Rental – Self Drive Cars Kashmir' },
    metaDescription: { type: String, default: 'Best self drive car rental in Kashmir. Rent hatchbacks, sedans & SUVs in Srinagar. Unlimited KMs, airport pickup, 24/7 support.' },
  },
  cancellationPolicy: { type: String, default: 'Free cancellation up to 24 hours before pickup. 50% refund for cancellations within 24 hours.' },
  termsAndConditions: { type: String, default: 'Driver must be 21+ years old with a valid driving license. Security deposit required at pickup.' },
}, { timestamps: true })

module.exports = mongoose.model('SiteSettings', SiteSettingsSchema)
