import { useState, useEffect } from 'react'
import { inquiriesAPI, bookingsAPI, carsAPI } from '../utils/api'
import { Search, Trash2, MessageSquare, Phone, Clock, ChevronDown, ExternalLink } from 'lucide-react'
import { formatDistanceToNow, format } from 'date-fns'
import toast from 'react-hot-toast'

const STATUSES = ['all', 'new', 'read', 'replied', 'closed']
const STATUS_STYLES = {
  new: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  read: 'bg-gray-100 text-gray-500 border-gray-300/50',
  replied: 'bg-green-100 text-green-700 border-green-500/20',
  closed: 'bg-red-100 text-red-600 border-red-500/20',
}

export default function Inquiries() {
  const [inquiries, setInquiries] = useState([])
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('all')
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState(null)
  const [deleteId, setDeleteId] = useState(null)
  const [convertInquiry, setConvertInquiry] = useState(null)

  const fetch = async () => {
    setLoading(true)
    try {
      const res = await inquiriesAPI.getAll({ status: status !== 'all' ? status : undefined })
      setInquiries(res.data?.data || [])
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
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input placeholder="Search by name or phone…" value={search} onChange={e => setSearch(e.target.value)} className="input pl-10 py-2.5" />
        </div>
        <div className="text-sm text-gray-500">{filtered.length} inquiries</div>
      </div>

      {/* Status tabs */}
      <div className="flex gap-2 flex-wrap">
        {STATUSES.map(s => (
          <button key={s} onClick={() => setStatus(s)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all capitalize ${status === s ? 'bg-primary text-white' : 'bg-white text-gray-500 border border-gray-200 hover:border-primary/30 hover:text-primary'}`}>
            {s}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <div className="card p-16 text-center">
          <div className="text-5xl mb-4">📭</div>
          <p className="text-gray-800 font-semibold">No inquiries found</p>
          <p className="text-gray-400 text-sm mt-1">Customer messages will appear here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(inq => (
            <div key={inq._id} className={`card overflow-hidden transition-all duration-200 ${inq.status === 'new' ? 'border-blue-500/30' : ''}`}>
              <div
                className="flex items-center gap-4 p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setExpanded(expanded === inq._id ? null : inq._id)}
              >
                {/* Avatar or Car Image */}
                <div className="flex-shrink-0">
                  {inq.carId?.images?.[0] ? (
                    <img src={inq.carId.images[0]} alt={inq.carId.name} className="w-10 h-10 rounded-lg object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                      <span className="text-primary font-bold text-sm">{(inq.name || '?').charAt(0).toUpperCase()}</span>
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-800">{inq.name || 'Unknown'}</p>
                    {inq.status === 'new' && <span className="w-2 h-2 rounded-full bg-blue-500 notif-dot" />}
                  </div>
                  <p className="text-sm text-gray-400 truncate mt-0.5">
                    {inq.carName ? `🚗 ${inq.carName}` : ''}{inq.message ? ` · ${inq.message}` : ''}{!inq.carName && !inq.message ? 'No message' : ''}
                  </p>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  {inq.source === 'booking' && <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: 'rgba(31,122,77,0.1)', color: '#1F7A4D' }}>BOOKING</span>}
                  <span className={`badge border ${STATUS_STYLES[inq.status] || STATUS_STYLES.new}`}>{inq.status || 'new'}</span>
                  <span className="text-xs text-gray-400 hidden md:block">
                    {inq.createdAt ? formatDistanceToNow(new Date(inq.createdAt), { addSuffix: true }) : ''}
                  </span>
                  <ChevronDown size={16} className={`text-gray-400 transition-transform ${expanded === inq._id ? 'rotate-180' : ''}`} />
                </div>
              </div>

              {/* Expanded detail */}
              {expanded === inq._id && (
                <div className="border-t border-gray-100 p-4" style={{ background: '#F5F7F6' }}>
                  {/* Car card */}
                  {inq.carId && (
                    <div className="mb-4 p-3 rounded-xl flex items-center gap-4" style={{ background: 'rgba(31,122,77,0.06)', border: '1px solid rgba(31,122,77,0.12)' }}>
                      {inq.carId.images?.[0] ? (
                        <img src={inq.carId.images[0]} alt={inq.carId.name} className="w-20 h-14 rounded-lg object-cover flex-shrink-0" />
                      ) : (
                        <div className="w-20 h-14 rounded-lg bg-gray-200 flex items-center justify-center flex-shrink-0 text-2xl">🚗</div>
                      )}
                      <div>
                        <p className="font-bold text-gray-800 text-sm">{inq.carId.name}</p>
                        <p className="text-xs text-gray-400">{inq.carId.color} · {inq.carId.category}</p>
                        <p className="text-sm font-bold mt-0.5 text-primary">₹{inq.carId.pricePerDay?.toLocaleString()}/day</p>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="label">Phone</p>
                      <p className="text-sm text-gray-800 flex items-center gap-1.5"><Phone size={13} className="text-primary" />{inq.phone || '—'}</p>
                    </div>
                    <div>
                      <p className="label">Email</p>
                      <p className="text-sm text-gray-800">{inq.email || '—'}</p>
                    </div>
                    <div>
                      <p className="label">Car Interest</p>
                      <p className="text-sm text-gray-800">{inq.carName || '—'}</p>
                    </div>
                    <div>
                      <p className="label">Pickup Date</p>
                      <p className="text-sm text-gray-800">{inq.pickupDate ? format(new Date(inq.pickupDate), 'dd MMM yyyy') : '—'}</p>
                    </div>
                    <div>
                      <p className="label">Return Date</p>
                      <p className="text-sm text-gray-800">{inq.dropoffDate ? format(new Date(inq.dropoffDate), 'dd MMM yyyy') : '—'}</p>
                    </div>
                    <div>
                      <p className="label">Received</p>
                      <p className="text-sm text-gray-800">{inq.createdAt ? format(new Date(inq.createdAt), 'dd MMM yyyy, hh:mm a') : '—'}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="label">Message</p>
                    <p className="text-sm text-gray-600 bg-gray-100 rounded-xl p-3 leading-relaxed">{inq.message || '—'}</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {/* Status change */}
                    <select
                      value={inq.status || 'new'}
                      onChange={e => changeStatus(inq._id, e.target.value)}
                      className="bg-gray-100 border border-gray-200 text-sm text-gray-700 rounded-xl px-3 py-2 outline-none focus:border-primary/40"
                    >
                      {['new','read','replied','closed'].map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
                    </select>

                    {/* WhatsApp reply */}
                    {inq.phone && (
                      <button
                        onClick={() => openWhatsApp(inq.phone, inq.name, inq.message)}
                        className="flex items-center gap-2 bg-green-50 hover:bg-green-100 text-green-600 border border-green-200 px-4 py-2 rounded-xl text-sm transition-all"
                      >
                        <span>💬</span> Reply on WhatsApp
                        <ExternalLink size={12} />
                      </button>
                    )}

                    <button
                      onClick={() => setConvertInquiry(inq)}
                      className="flex items-center gap-2 bg-primary/10 hover:bg-primary/15 text-primary border border-primary/20 px-4 py-2 rounded-xl text-sm transition-all"
                    >
                      📋 Convert to Booking
                    </button>

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
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-black/5 rounded-2xl p-6 max-w-sm w-full shadow-lg">
            <h3 className="font-bold text-gray-800 text-lg mb-2">Delete Inquiry?</h3>
            <p className="text-gray-500 text-sm mb-6">This will permanently remove this inquiry.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="btn-outline flex-1">Cancel</button>
              <button onClick={() => handleDelete(deleteId)} className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-xl font-semibold transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Convert to Booking Modal */}
      {convertInquiry && (
        <ConvertBookingModal
          inquiry={convertInquiry}
          onClose={() => setConvertInquiry(null)}
          onConverted={() => {
            setConvertInquiry(null)
            setInquiries(prev => prev.filter(i => i._id !== convertInquiry._id))
            toast.success('Booking created from inquiry!')
          }}
        />
      )}
    </div>
  )
}

function ConvertBookingModal({ inquiry, onClose, onConverted }) {
  const [cars, setCars] = useState([])
  const [form, setForm] = useState({
    customerName: inquiry.name || '',
    phone: inquiry.phone || '',
    email: inquiry.email || '',
    carId: inquiry.carId && typeof inquiry.carId === 'object' ? inquiry.carId._id : '',
    carName: inquiry.carName || '',
    pickupDate: inquiry.pickupDate ? inquiry.pickupDate.split('T')[0] : '',
    dropoffDate: inquiry.dropoffDate ? inquiry.dropoffDate.split('T')[0] : '',
    notes: inquiry.message || '',
    status: 'confirmed',
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    carsAPI.getAll({ limit: 100 }).then(res => setCars(res.data?.data || [])).catch(() => {})
  }, [])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const selectedCar = cars.find(c => c._id === form.carId) || (form.carId && inquiry.carId?.name ? inquiry.carId : null)
  const days = form.pickupDate && form.dropoffDate
    ? Math.max(1, Math.ceil((new Date(form.dropoffDate) - new Date(form.pickupDate)) / 86400000))
    : 0
  const pricePerDay = selectedCar?.pricePerDay || inquiry.carId?.pricePerDay || 0
  const total = days && pricePerDay ? days * pricePerDay : 0

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await bookingsAPI.create({
        customerName: form.customerName,
        phone: form.phone,
        email: form.email,
        carId: form.carId || inquiry.carId?._id,
        carName: selectedCar?.name || inquiry.carId?.name || form.carName,
        pickupDate: form.pickupDate,
        dropoffDate: form.dropoffDate,
        totalDays: days,
        totalPrice: total,
        notes: form.notes,
        status: form.status,
      })
      await inquiriesAPI.updateStatus(inquiry._id, 'closed')
      onConverted()
    } catch {
      toast.error('Failed to create booking')
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white border border-black/5 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="flex items-center justify-between p-5" style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
          <div>
            <h3 className="font-bold text-gray-800 text-lg">Convert to Booking</h3>
            <p className="text-gray-400 text-xs mt-0.5">From inquiry — {inquiry.name}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors">✕</button>
        </div>
        <form onSubmit={submit} className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2"><label className="label">Customer Name *</label><input required value={form.customerName} onChange={e => set('customerName', e.target.value)} className="input" /></div>
            <div><label className="label">Phone</label><input value={form.phone} onChange={e => set('phone', e.target.value)} className="input" /></div>
            <div><label className="label">Email</label><input type="email" value={form.email} onChange={e => set('email', e.target.value)} className="input" /></div>
            <div className="col-span-2">
              <label className="label">Car</label>
              <select value={typeof form.carId === 'string' ? form.carId : ''} onChange={e => set('carId', e.target.value)} className="input">
                <option value="">Select a car…</option>
                {cars.map(c => <option key={c._id} value={c._id}>{c.name} — ₹{c.pricePerDay?.toLocaleString()}/day</option>)}
              </select>
              {inquiry.carId?.name && !form.carId && (
                <p className="text-xs text-gray-400 mt-1">Current: {inquiry.carId.name}</p>
              )}
            </div>
            <div><label className="label">Pickup Date *</label><input required type="date" value={form.pickupDate} onChange={e => set('pickupDate', e.target.value)} className="input" /></div>
            <div><label className="label">Return Date *</label><input required type="date" value={form.dropoffDate} onChange={e => set('dropoffDate', e.target.value)} className="input" /></div>
            <div className="col-span-2"><label className="label">Notes</label><textarea value={form.notes} onChange={e => set('notes', e.target.value)} rows={2} className="input resize-none" /></div>
          </div>

          {days > 0 && pricePerDay > 0 && (
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-sm">
              <div className="flex justify-between text-gray-500"><span>Duration</span><span>{days} days</span></div>
              <div className="flex justify-between text-gray-500 mt-1"><span>Rate</span><span>₹{pricePerDay?.toLocaleString()}/day</span></div>
              <div className="flex justify-between text-primary font-bold text-base mt-2 pt-2" style={{ borderTop: '1px solid rgba(31,122,77,0.15)' }}><span>Total</span><span>₹{total.toLocaleString()}</span></div>
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="btn-outline flex-1">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2">
              {loading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Creating…</> : 'Create Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
