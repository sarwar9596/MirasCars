import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { blogsAPI } from '../utils/api'
import { ArrowLeft, Eye, Save, Bold, Italic, List } from 'lucide-react'
import toast from 'react-hot-toast'

const CATEGORIES = ['Travel', 'Kashmir Guide', 'Car Tips', 'Season Guide', 'News', 'Adventure']

const INITIAL = {
  title: '', slug: '', category: 'Travel',
  excerpt: '', content: '', featuredImage: '',
  tags: [], status: 'draft', author: 'Miras Team',
  metaTitle: '', metaDescription: '',
}

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export default function AddEditBlog() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id
  const [form, setForm] = useState(INITIAL)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(isEdit)
  const [preview, setPreview] = useState(false)
  const [newTag, setNewTag] = useState('')

  useEffect(() => {
    if (!isEdit) return
    blogsAPI.getById(id)
      .then(res => {
        const d = res.data?.blog || res.data
        setForm({ ...INITIAL, ...d, tags: d.tags || [] })
      })
      .catch(() => toast.error('Failed to load post'))
      .finally(() => setFetching(false))
  }, [id])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleTitleChange = (val) => {
    setForm(f => ({ ...f, title: val, slug: f.slug || slugify(val) }))
  }

  const addTag = () => {
    if (!newTag.trim()) return
    set('tags', [...form.tags, newTag.trim()])
    setNewTag('')
  }

  const removeTag = (i) => set('tags', form.tags.filter((_, idx) => idx !== i))

  const insertFormat = (prefix, suffix = '') => {
    const ta = document.getElementById('content-editor')
    const start = ta.selectionStart, end = ta.selectionEnd
    const selected = form.content.slice(start, end)
    const newText = form.content.slice(0, start) + prefix + selected + suffix + form.content.slice(end)
    set('content', newText)
    setTimeout(() => { ta.focus(); ta.setSelectionRange(start + prefix.length, end + prefix.length) }, 0)
  }

  const handleSubmit = async (e, asDraft = false) => {
    e.preventDefault()
    if (!form.title.trim()) { toast.error('Title is required'); return }
    setLoading(true)
    try {
      const payload = {
        ...form,
        status: asDraft ? 'draft' : 'published',
        slug: form.slug || slugify(form.title),
        metaTitle: form.metaTitle || form.title,
        metaDescription: form.metaDescription || form.excerpt,
      }
      if (isEdit) {
        await blogsAPI.update(id, payload)
        toast.success('Post updated!')
      } else {
        await blogsAPI.create(payload)
        toast.success('Post created!')
      }
      navigate('/blogs')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-brand-gold/30 border-t-brand-gold rounded-full animate-spin"/></div>

  return (
    <div className="max-w-5xl mx-auto page-enter">
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => navigate('/blogs')} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm">
          <ArrowLeft size={16} /> Back to Blogs
        </button>
        <button onClick={() => setPreview(p => !p)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all ${preview ? 'bg-brand-gold/20 text-brand-gold border border-brand-gold/30' : 'btn-outline'}`}>
          <Eye size={15} /> {preview ? 'Edit' : 'Preview'}
        </button>
      </div>

      {preview ? (
        /* Preview pane */
        <div className="card p-8">
          {form.featuredImage && <img src={form.featuredImage} alt="" className="w-full h-64 object-cover rounded-xl mb-6" />}
          <span className="text-brand-gold text-sm font-medium">{form.category}</span>
          <h1 className="font-display text-3xl font-bold text-white mt-2 mb-3">{form.title || 'Untitled Post'}</h1>
          {form.excerpt && <p className="text-gray-400 text-lg mb-6 italic">{form.excerpt}</p>}
          <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed whitespace-pre-wrap">{form.content || 'No content yet…'}</div>
          {form.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-dark-400">
              {form.tags.map((t, i) => <span key={i} className="bg-dark-600 text-gray-400 px-3 py-1 rounded-full text-xs">#{t}</span>)}
            </div>
          )}
        </div>
      ) : (
        /* Edit form */
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Main editor */}
            <div className="lg:col-span-2 space-y-5">
              <div className="card p-5 space-y-4">
                <div>
                  <label className="label">Post Title *</label>
                  <input value={form.title} onChange={e => handleTitleChange(e.target.value)} placeholder="e.g. Best Roads to Drive in Kashmir" className="input text-lg font-display" />
                </div>
                <div>
                  <label className="label">URL Slug</label>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600 text-sm">/blog/</span>
                    <input value={form.slug} onChange={e => set('slug', e.target.value)} placeholder="auto-generated-from-title" className="input flex-1" />
                  </div>
                </div>
                <div>
                  <label className="label">Excerpt / Summary</label>
                  <textarea value={form.excerpt} onChange={e => set('excerpt', e.target.value)} placeholder="A brief 1–2 line summary shown in blog listings…" rows={2} className="input resize-none" />
                </div>
              </div>

              {/* Content editor */}
              <div className="card p-5">
                <div className="flex items-center justify-between mb-3">
                  <label className="label mb-0">Content *</label>
                  {/* Formatting toolbar */}
                  <div className="flex gap-1">
                    {[
                      { icon: Bold, action: () => insertFormat('**', '**'), title: 'Bold' },
                      { icon: Italic, action: () => insertFormat('_', '_'), title: 'Italic' },
                      { icon: List, action: () => insertFormat('\n- '), title: 'List' },
                    ].map(btn => (
                      <button key={btn.title} type="button" onClick={btn.action} title={btn.title}
                        className="w-8 h-8 rounded-lg bg-dark-600 hover:bg-dark-500 text-gray-400 hover:text-white flex items-center justify-center transition-colors">
                        <btn.icon size={14} />
                      </button>
                    ))}
                    <button type="button" onClick={() => insertFormat('\n## ')} className="w-8 h-8 rounded-lg bg-dark-600 hover:bg-dark-500 text-gray-400 hover:text-white flex items-center justify-center text-xs font-bold transition-colors">H2</button>
                    <button type="button" onClick={() => insertFormat('\n### ')} className="w-8 h-8 rounded-lg bg-dark-600 hover:bg-dark-500 text-gray-400 hover:text-white flex items-center justify-center text-xs font-bold transition-colors">H3</button>
                  </div>
                </div>
                <textarea
                  id="content-editor"
                  value={form.content}
                  onChange={e => set('content', e.target.value)}
                  placeholder="Write your blog post here…&#10;&#10;Use ## for headings, **bold**, _italic_, and - for bullet lists."
                  rows={18}
                  className="input resize-none font-mono text-sm leading-relaxed"
                />
                <p className="text-xs text-gray-600 mt-2">{form.content.split(/\s+/).filter(Boolean).length} words · {form.content.length} chars</p>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-5">
              {/* Publish settings */}
              <div className="card p-5">
                <h3 className="font-semibold text-white mb-4">Publish Settings</h3>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-400">{form.status === 'published' ? 'Published' : 'Draft'}</span>
                  <button type="button" onClick={() => set('status', form.status === 'published' ? 'draft' : 'published')}
                    className={`w-12 h-6 rounded-full transition-all ${form.status === 'published' ? 'bg-brand-gold' : 'bg-dark-500'} relative`}>
                    <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all ${form.status === 'published' ? 'left-6' : 'left-0.5'}`} />
                  </button>
                </div>
                <div className="space-y-3">
                  <div><label className="label">Author</label><input value={form.author} onChange={e => set('author', e.target.value)} className="input py-2" /></div>
                  <div>
                    <label className="label">Category</label>
                    <select value={form.category} onChange={e => set('category', e.target.value)} className="input py-2">
                      {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <button type="submit" disabled={loading} className="btn-gold w-full flex items-center justify-center gap-2">
                    {loading ? <><div className="w-4 h-4 border-2 border-dark-900/30 border-t-dark-900 rounded-full animate-spin"/>Saving…</> : <><Save size={15}/>{isEdit ? 'Update Post' : 'Publish Post'}</>}
                  </button>
                  <button type="button" onClick={e => handleSubmit(e, true)} className="btn-outline w-full text-sm py-2">Save as Draft</button>
                </div>
              </div>

              {/* Cover image */}
              <div className="card p-5">
                <h3 className="font-semibold text-white mb-3">Cover Image</h3>
                <input value={form.featuredImage} onChange={e => set('featuredImage', e.target.value)} placeholder="https://..." className="input text-sm" />
                {form.featuredImage && (
                  <img src={form.featuredImage} alt="" className="mt-3 w-full h-32 object-cover rounded-xl" onError={e => e.target.style.display='none'} />
                )}
              </div>

              {/* Tags */}
              <div className="card p-5">
                <h3 className="font-semibold text-white mb-3">Tags</h3>
                <div className="flex gap-2 mb-3">
                  <input value={newTag} onChange={e => setNewTag(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())} placeholder="Add tag…" className="input text-sm flex-1 py-2" />
                  <button type="button" onClick={addTag} className="btn-outline px-3 py-2 text-sm">+</button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {form.tags.map((tag, i) => (
                    <span key={i} className="flex items-center gap-1 bg-dark-600 text-gray-400 text-xs px-2.5 py-1 rounded-full">
                      #{tag}
                      <button type="button" onClick={() => removeTag(i)} className="text-gray-600 hover:text-red-400 ml-0.5">✕</button>
                    </span>
                  ))}
                </div>
              </div>

              {/* SEO */}
              <div className="card p-5">
                <h3 className="font-semibold text-white mb-3">SEO</h3>
                <div className="space-y-3">
                  <div><label className="label">Meta Title</label><input value={form.metaTitle} onChange={e => set('metaTitle', e.target.value)} placeholder="Leave blank to use post title" className="input text-sm py-2" /></div>
                  <div><label className="label">Meta Description</label><textarea value={form.metaDescription} onChange={e => set('metaDescription', e.target.value)} placeholder="Leave blank to use excerpt" rows={3} className="input text-sm resize-none" /></div>
                </div>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  )
}
