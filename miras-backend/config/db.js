const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI)
    console.log(`✅ MongoDB connected: ${conn.connection.host}`)
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`)
    console.log('\n💡 Tip: Make sure MongoDB is running locally OR update MONGODB_URI in .env')
    console.log('   MongoDB Atlas free tier: https://www.mongodb.com/cloud/atlas\n')
    process.exit(1)
  }
}

module.exports = connectDB
