const express   = require('express')
const router    = express.Router()
const slugify   = require('slugify')
const BlogPost  = require('../models/BlogPost')
const { protect } = require('../middleware/auth')

// GET /api/blog  (public)
router.get('/', async (req, res) => {
  try {
    const { status, limit = 20 } = req.query
    let query = {}
    if (status) query.status = status
    else query.status = 'published' // public only sees published
    const posts = await BlogPost.find(query).sort({ createdAt: -1 }).limit(Number(limit))
    res.json({ success: true, count: posts.length, data: posts })
  } catch (err) { res.status(500).json({ success: false, error: err.message }) }
})

// GET /api/blog/all  (admin – sees drafts too)
router.get('/all', protect, async (req, res) => {
  try {
    const posts = await BlogPost.find().sort({ createdAt: -1 })
    res.json({ success: true, count: posts.length, data: posts })
  } catch (err) { res.status(500).json({ success: false, error: err.message }) }
})

// GET /api/blog/:slug  (public)
router.get('/:slug', async (req, res) => {
  try {
    const post = await BlogPost.findOne({ slug: req.params.slug })
    if (!post) return res.status(404).json({ success: false, error: 'Post not found' })
    await BlogPost.findByIdAndUpdate(post._id, { $inc: { views: 1 } })
    res.json({ success: true, data: post })
  } catch (err) { res.status(500).json({ success: false, error: err.message }) }
})

// POST /api/blog  (admin)
router.post('/', protect, async (req, res) => {
  try {
    const base = slugify(req.body.title, { lower: true, strict: true })
    req.body.slug = base + '-' + Date.now()
    // Auto read time
    const wordCount = (req.body.content || '').replace(/<[^>]+>/g, '').split(' ').length
    req.body.readTime = `${Math.ceil(wordCount / 200)} min read`
    // Auto excerpt
    if (!req.body.excerpt) {
      req.body.excerpt = req.body.content?.replace(/<[^>]+>/g, '').substring(0, 160) + '...'
    }
    const post = await BlogPost.create(req.body)
    res.status(201).json({ success: true, data: post })
  } catch (err) { res.status(400).json({ success: false, error: err.message }) }
})

// PUT /api/blog/:id  (admin)
router.put('/:id', protect, async (req, res) => {
  try {
    if (req.body.content) {
      const wordCount = req.body.content.replace(/<[^>]+>/g, '').split(' ').length
      req.body.readTime = `${Math.ceil(wordCount / 200)} min read`
    }
    const post = await BlogPost.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!post) return res.status(404).json({ success: false, error: 'Post not found' })
    res.json({ success: true, data: post })
  } catch (err) { res.status(400).json({ success: false, error: err.message }) }
})

// DELETE /api/blog/:id  (admin)
router.delete('/:id', protect, async (req, res) => {
  try {
    await BlogPost.findByIdAndDelete(req.params.id)
    res.json({ success: true, message: 'Post deleted' })
  } catch (err) { res.status(500).json({ success: false, error: err.message }) }
})

module.exports = router
