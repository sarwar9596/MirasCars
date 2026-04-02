import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { blogsAPI } from '../utils/api'
import api from '../utils/api'
import { Plus, Edit2, Trash2, Search, Eye, EyeOff } from 'lucide-react'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

export default function Blogs() {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [deleteId, setDeleteId] = useState(null)

  const fetchBlogs = async () => {
    try {
      const res = await api.get('/blog/all')
      setBlogs(res.data?.data || res.data || [])
    } catch { toast.error('Failed to load blogs') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchBlogs() }, [])

  const togglePublish = async (blog) => {
    try {
      const newStatus = blog.status === 'published' ? 'draft' : 'published'
      await blogsAPI.update(blog._id, { ...blog, status: newStatus })
      setBlogs(prev => prev.map(b => b._id === blog._id ? { ...b, status: newStatus } : b))
      toast.success(newStatus === 'published' ? 'Post published!' : 'Post unpublished')
    } catch { toast.error('Update failed') }
  }

  const handleDelete = async (id) => {
    try {
      await blogsAPI.delete(id)
      setBlogs(prev => prev.filter(b => b._id !== id))
      toast.success('Blog post deleted')
    } catch { toast.error('Delete failed') }
    setDeleteId(null)
  }

  const filtered = blogs.filter(b => !search || b.title?.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="space-y-5 page-enter">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input placeholder="Search posts…" value={search} onChange={e => setSearch(e.target.value)} className="input pl-10 py-2.5" />
        </div>
        <Link to="/blogs/add" className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Write Post
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin"/></div>
      ) : filtered.length === 0 ? (
        <div className="card p-16 text-center">
          <div className="text-5xl mb-4">📝</div>
          <p className="text-gray-800 font-semibold">No blog posts yet</p>
          <p className="text-gray-400 text-sm mt-1 mb-4">Write your first post about Kashmir travel & car tips</p>
          <Link to="/blogs/add" className="btn-primary inline-flex items-center gap-2"><Plus size={15}/>Write First Post</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(blog => (
            <div key={blog._id} className="card overflow-hidden group hover:border-primary/30 transition-all duration-300">
              {/* Cover image */}
              <div className="h-40 bg-gray-100 overflow-hidden relative">
                {blog.featuredImage ? (
                  <img src={blog.featuredImage} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl">📰</div>
                )}
                <div className={`absolute top-3 right-3 badge ${blog.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                  {blog.status === 'published' ? 'Published' : 'Draft'}
                </div>
              </div>

              <div className="p-4">
                <p className="text-xs text-primary mb-1 font-medium">{blog.category || 'Travel'}</p>
                <h3 className="font-bold text-gray-800 mb-1 line-clamp-2">{blog.title}</h3>
                <p className="text-sm text-gray-400 line-clamp-2 mb-3">{blog.excerpt || blog.content?.slice(0, 100)}</p>
                <p className="text-xs text-gray-300 mb-4">{blog.createdAt ? format(new Date(blog.createdAt), 'dd MMM yyyy') : '—'}</p>

                <div className="flex items-center gap-2">
                  <Link to={`/blogs/edit/${blog._id}`} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-gray-100 hover:bg-primary/10 hover:text-primary text-gray-500 text-sm transition-all">
                    <Edit2 size={13} /> Edit
                  </Link>
                  <button onClick={() => togglePublish(blog)}
                    className={`w-10 h-9 flex items-center justify-center rounded-xl transition-all text-sm ${blog.status === 'published' ? 'bg-gray-100 hover:bg-amber-50 hover:text-amber-500 text-gray-400' : 'bg-gray-100 hover:bg-green-50 hover:text-green-600 text-gray-400'}`}
                    title={blog.status === 'published' ? 'Unpublish' : 'Publish'}>
                    {blog.status === 'published' ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                  <button onClick={() => setDeleteId(blog._id)}
                    className="w-10 h-9 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-red-50 hover:text-red-500 text-gray-400 transition-all">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-black/5 rounded-2xl p-6 max-w-sm w-full shadow-lg">
            <h3 className="font-bold text-gray-800 text-lg mb-2">Delete Post?</h3>
            <p className="text-gray-400 text-sm mb-6">This will permanently remove this blog post from your website.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="btn-outline flex-1">Cancel</button>
              <button onClick={() => handleDelete(deleteId)} className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-xl font-semibold transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
