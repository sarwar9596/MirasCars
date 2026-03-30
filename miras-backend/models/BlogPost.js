const mongoose = require('mongoose')

const BlogPostSchema = new mongoose.Schema({
  title:           { type: String, required: true },
  slug:            { type: String, required: true, unique: true },
  featuredImage:   { type: String },
  content:         { type: String },
  excerpt:         { type: String },
  category:        { type: String, default: 'Travel Guide' },
  tags:            [{ type: String }],
  metaTitle:       { type: String },
  metaDescription: { type: String },
  status:          { type: String, enum: ['draft','published'], default: 'draft' },
  author:          { type: String, default: 'Miras Car Rental' },
  readTime:        { type: String },
  views:           { type: Number, default: 0 },
}, { timestamps: true })

module.exports = mongoose.model('BlogPost', BlogPostSchema)
