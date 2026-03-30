import { useState, useEffect } from 'react'
import { inquiriesAPI } from '../utils/api'
import { Search, Trash2, MessageSquare, Phone, Clock, ChevronDown, ExternalLink } from 'lucide-react'
import { formatDistanceToNow, format } from 'date-fns'
import toast from 'react-hot-toast'

const STATUSES = ['all', 'new', 'read', 'replied', 'closed']
const STATUS_STYLES = {
  new: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  read: 'bg-gray-500/15 text-gray-400 border-gray-500/30',
  replied: 'bg-green-500/15 text-green-400 border-green-500/30',
  closed: 'bg-red-500/15 text-red-400 border-red-500/30',
}

export default function Inquiries() {
  const [inquiries, setInquiries] = useState([])
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('all')
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState(null)
  const [deleteId, setDeleteId] = useState(null)

  const fetch = async () => {
    setLoading(true)
    try {
      const res = await inquiriesAPI.getAll({ status: status !== 'all' ? status : undefined })
      setInquiries(res.data?.inquiries || res.data || [])
    } catch { toast.error('Failed to load inquiries') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetch() }, [status])

  const changeStatus = async (id, newStatus) => {
    try {
      await inquiriesAPI.updateStatus(id, newStatus)
      setInquiries(prev => prev.map(i => i._id === id ? { ...i, status: newStatus } : i))
      toast.success('Status updated')
    } catch { toast.error('Update failed') }
  }

  const handleDelete = async (id) => {
    try {
      await inquiriesAPI.delete(id)
      setInquiries(prev => prev.filter(i => i._id !== id))
      toast.success('Inquiry deleted')
    } catch { toast.error('Delete failed') }
    setDeleteId(null)
  }

  const filtered = inquiries.filter(inq =>
    !search ||
    inq.name?.toLowerCase().includes(search.toLowerCase()) ||
    inq.phone?.includes(search) ||
    inq.message?.toLowerCase().includes(search.toLowerCase())
  )

  const openWhatsApp = (phone, name, message) => {
    const clean = phone?.replace(/\D/g, '')
    const text = encodeURIComponent(`Hi ${name}, thank you for contacting Miras Car Rental. Regarding your query: "${message?.slice(0, 100)}"`)
    window.open(`https://wa.me/${clean}?text=${text}`, '_blank')
  }

  return (
    <div className="space-y-5 page-enter">
      {/* Header */}
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
          <input placeholder="Search by name or phone…" value={search} onChange={e => setSearch(e.target.value)} className="input pl-10 py-2.5" />
        </div>
        <div className="text-sm text-gray-500">{filtered.length} inquiries</div>
      </div>

      {/* Status tabs */}
      <div className="flex gap-2 flex-wrap">
        {STATUSES.map(s => (
          <button key={s} onClick={() => setStatus(s)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all capitalize ${status === s ? 'bg-brand-gold text-dark-900' : 'bg-dark-600 text-gray-400 hover:text-white border border-dark-400'}`}>
            {s}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-brand-gold/30 border-t-brand-gold rounded-full animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <div className="card p-16 text-center">
          <div className="text-5xl mb-4">📭</div>
          <p className="text-white font-semibold">No inquiries found</p>
          <p className="text-gray-500 text-sm mt-1">Customer messages will appear here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(inq => (
            <div key={inq._id} className={`card overflow-hidden transition-all duration-200 ${inq.status === 'new' ? 'border-blue-500/30' : ''}`}>
              <div
                className="flex items-center gap-4 p-4 cursor-pointer hover:bg-dark-600/20 transition-colors"
                onClick={() => setExpanded(expanded === inq._id ? null : inq._id)}
              >
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-brand-gold/20 border border-brand-gold/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-brand-gold font-bold text-sm">{(inq.name || '?').charAt(0).toUpperCase()}</span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-white">{inq.name || 'Unknown'}</p>
                    {inq.status === 'new' && <span className="w-2 h-2 rounded-full bg-blue-400 notif-dot" />}
                  </div>
                  <p className="text-sm text-gray-400 truncate mt-0.5">{inq.message || 'No message'}</p>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className={`badge border ${STATUS_STYLES[inq.status] || STATUS_STYLES.new}`}>{inq.status || 'new'}</span>
                  <span className="text-xs text-gray-600 hidden md:block">
                    {inq.createdAt ? formatDistanceToNow(new Date(inq.createdAt), { addSuffix: true }) : ''}
                  </span>
                  <ChevronDown size={16} className={`text-gray-500 transition-transform ${expanded === inq._id ? 'rotate-180' : ''}`} />
                </div>
              </div>

              {/* Expanded detail */}
              {expanded === inq._id && (
                <div className="border-t border-dark-400/40 p-4 bg-dark-600/20">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="label">Phone</p>
                      <p className="text-sm text-white flex items-center gap-1.5"><Phone size={13} className="text-brand-gold" />{inq.phone || '—'}</p>
                    </div>
                    <div>
                      <p className="label">Email</p>
                      <p className="text-sm text-white">{inq.email || '—'}</p>
                    </div>
                    <div>
                      <p className="label">Car Interest</p>
                      <p className="text-sm text-white">{inq.carInterest || inq.carId || '—'}</p>
                    </div>
                    <div>
                      <p className="label">Pickup Date</p>
                      <p className="text-sm text-white">{inq.pickupDate ? format(new Date(inq.pickupDate), 'dd MMM yyyy') : '—'}</p>
                    </div>
                    <div>
                      <p className="label">Return Date</p>
                      <p className="text-sm text-white">{inq.returnDate ? format(new Date(inq.returnDate), 'dd MMM yyyy') : '—'}</p>
                    </div>
                    <div>
                      <p className="label">Received</p>
                      <p className="text-sm text-white">{inq.createdAt ? format(new Date(inq.createdAt), 'dd MMM yyyy, hh:mm a') : '—'}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="label">Message</p>
                    <p className="text-sm text-gray-300 bg-dark-700/50 rounded-xl p-3 leading-relaxed">{inq.message || '—'}</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {/* Status change */}
                    <select
                      value={inq.status || 'new'}
                      onChange={e => changeStatus(inq._id, e.target.value)}
                      className="bg-dark-600 border border-dark-400 text-sm text-gray-300 rounded-xl px-3 py-2 outline-none"
                    >
                      {['new','read','replied','closed'].map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
                    </select>

                    {/* WhatsApp reply */}
                    {inq.phone && (
                      <button
                        onClick={() => openWhatsApp(inq.phone, inq.name, inq.message)}
                        className="flex items-center gap-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/30 px-4 py-2 rounded-xl text-sm transition-all"
                      >
                        <span>💬</span> Reply on WhatsApp
                        <ExternalLink size={12} />
                      </button>
                    )}

                    <button onClick={() => setDeleteId(inq._id)} className="btn-danger ml-auto">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Delete modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-surface-raised border border-dark-400 rounded-2xl p-6 max-w-sm w-full">
            <h3 className="font-display font-bold text-white text-lg mb-2">Delete Inquiry?</h3>
            <p className="text-gray-400 text-sm mb-6">This will permanently remove this inquiry.</p>
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
