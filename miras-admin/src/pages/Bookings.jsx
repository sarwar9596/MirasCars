import { useState, useEffect } from 'react'
import { bookingsAPI, carsAPI } from '../utils/api'
import { Plus, Search, Trash2, Edit2, ExternalLink, Calendar, User, Car, ChevronDown } from 'lucide-react'
import { format, formatDistanceToNow } from 'date-fns'
import toast from 'react-hot-toast'

const STATUS_STYLES = {
  pending:   'bg-amber-100 text-amber-600 border-amber-300/50',
  confirmed: 'bg-green-100 text-green-700 border-green-300/50',
  ongoing:   'bg-blue-100 text-blue-600 border-blue-300/50',
  completed: 'bg-gray-100 text-gray-500 border-gray-300/50',
  cancelled: 'bg-red-100 text-red-600 border-red-300/50',
}

const ALL_STATUSES = ['pending','confirmed','ongoing','completed','cancelled']

export default function Bookings() {
  const [bookings, setBookings] = useState([])
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState(null)
  const [showAdd, setShowAdd] = useState(false)
  const [deleteId, setDeleteId] = useState(null)

  const fetchAll = async () => {
    setLoading(true)
    try {
      const [bRes, cRes] = await Promise.all([
        bookingsAPI.getAll({ status: filter !== 'all' ? filter : undefined }),
        carsAPI.getAll({ limit: 100 }),
      ])
      setBookings(bRes.data?.data || [])
      setCars(cRes.data?.data || [])
    } catch { toast.error('Failed to load bookings') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchAll() }, [filter])

  const changeStatus = async (id, status) => {
    try {
      await bookingsAPI.updateStatus(id, status)
      setBookings(prev => prev.map(b => b._id === id ? { ...b, status } : b))
      toast.success('Booking status updated')
    } catch { toast.error('Update failed') }
  }

  const handleDelete = async (id) => {
    try {
      await bookingsAPI.delete(id)
      setBookings(prev => prev.filter(b => b._id !== id))
      toast.success('Booking deleted')
    } catch { toast.error('Delete failed') }
    setDeleteId(null)
  }

  const filtered = bookings.filter(b =>
    !search ||
    b.customerName?.toLowerCase().includes(search.toLowerCase()) ||
    b.phone?.includes(search) ||
    b.carName?.toLowerCase().includes(search.toLowerCase())
  )

  const openWhatsApp = (phone, name, details) => {
    const clean = phone?.replace(/\D/g, '')
    const text = encodeURIComponent(`Hi ${name}, your booking at Miras Car Rental has been confirmed! ${details}`)
    window.open(`https://wa.me/${clean}?text=${text}`, '_blank')
  }

  const whatsappBook = (phone, name, days) => {
    const clean = phone?.replace(/\D/g, '')
    const text = encodeURIComponent(`Hi ${name}, your booking at Miras Car Rental is confirmed for ${days} days! We'll be in touch soon.`)
    window.open(`https://wa.me/${clean}?text=${text}`, '_blank')
  }

  const counts = ALL_STATUSES.reduce((acc, s) => {
    acc[s] = bookings.filter(b => b.status === s).length
    return acc
  }, {})

  return (
    <div className="space-y-5 page-enter">
      {/* Summary row */}
      <div className="grid grid-cols-5 gap-3">
        {ALL_STATUSES.map(s => (
          <button key={s} onClick={() => setFilter(s === filter ? 'all' : s)}
            className={`card p-3 text-center transition-all hover:border-primary/30 ${filter === s ? 'border border-primary/30' : ''}`}>
            <p className="text-xl font-bold text-gray-800">{counts[s]}</p>
            <p className="text-xs text-gray-400 capitalize mt-0.5">{s}</p>
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input placeholder="Search customer or car…" value={search} onChange={e => setSearch(e.target.value)} className="input pl-10 py-2.5" />
        </div>
        <button onClick={() => setShowAdd(true)} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Add Booking
        </button>
      </div>

      {/* All/filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {['all', ...ALL_STATUSES].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-all ${filter === s ? 'bg-primary text-white' : 'bg-white text-gray-500 border border-gray-200 hover:border-primary/30 hover:text-primary'}`}>
            {s}
          </button>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <div className="card p-16 text-center">
          <div className="text-5xl mb-4">📋</div>
          <p className="text-gray-800 font-semibold">No bookings yet</p>
          <p className="text-gray-400 text-sm mt-1">Bookings from your website will appear here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(book => (
            <div key={book._id} className={`card overflow-hidden ${book.status === 'pending' ? 'border-amber-300/30' : ''}`}>
              <div
                className="flex items-center gap-4 p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setExpanded(expanded === book._id ? null : book._id)}
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary text-sm font-bold">{(book.customerName || '?').charAt(0)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-800">{book.customerName || 'Customer'}</p>
                    {book.status === 'pending' && <span className="w-2 h-2 rounded-full bg-amber-400 notif-dot" />}
                  </div>
                  <p className="text-sm text-gray-400">{book.carName || book.car?.name || 'Car'} · {book.totalDays || '—'} days</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <p className="text-primary font-semibold">₹{book.totalPrice?.toLocaleString() || '—'}</p>
                  <span className={`badge border ${STATUS_STYLES[book.status] || STATUS_STYLES.pending}`}>{book.status}</span>
                  <ChevronDown size={16} className={`text-gray-400 transition-transform ${expanded === book._id ? 'rotate-180' : ''}`} />
                </div>
              </div>

              {expanded === book._id && (
                <div className="border-t border-gray-100 p-4 space-y-4" style={{ background: '#F5F7F6' }}>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div><p className="label">Customer</p><p className="text-sm text-gray-800">{book.customerName}</p></div>
                    <div><p className="label">Phone</p><p className="text-sm text-gray-800">{book.phone || '—'}</p></div>
                    <div><p className="label">Email</p><p className="text-sm text-gray-800">{book.email || '—'}</p></div>
                    <div><p className="label">Car</p><p className="text-sm text-gray-800">{book.carName || '—'}</p></div>
                    <div><p className="label">Pickup</p><p className="text-sm text-gray-800">{book.pickupDate ? format(new Date(book.pickupDate), 'dd MMM yyyy') : '—'}</p></div>
                    <div><p className="label">Return</p><p className="text-sm text-gray-800">{book.dropoffDate ? format(new Date(book.dropoffDate), 'dd MMM yyyy') : '—'}</p></div>
                    <div><p className="label">Duration</p><p className="text-sm text-gray-800">{book.totalDays || '—'} days</p></div>
                    <div><p className="label">Total</p><p className="text-sm text-primary font-semibold">₹{book.totalPrice?.toLocaleString()}</p></div>
                  </div>

                  {book.notes && (
                    <div>
                      <p className="label">Notes</p>
                      <p className="text-sm text-gray-600 bg-gray-100 rounded-xl p-3">{book.notes}</p>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2">
                    <select value={book.status} onChange={e => changeStatus(book._id, e.target.value)}
                      className="bg-gray-100 border border-gray-200 text-sm text-gray-700 rounded-xl px-3 py-2 outline-none focus:border-primary/40">
                      {ALL_STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
                    </select>
                    {book.phone && (
                      <button onClick={() => openWhatsApp(book.phone, book.customerName, `${book.carName}, ${book.totalDays} days`)}
                        className="flex items-center gap-2 bg-green-50 hover:bg-green-100 text-green-600 border border-green-200 px-4 py-2 rounded-xl text-sm transition-all">
                        💬 WhatsApp <ExternalLink size={12} />
                      </button>
                    )}
                    <button onClick={() => setDeleteId(book._id)} className="btn-danger ml-auto"><Trash2 size={14} /></button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add Booking Modal */}
      {showAdd && <AddBookingModal cars={cars} onClose={() => setShowAdd(false)} onSaved={() => { setShowAdd(false); fetchAll() }} prefilled={null} />}

      {/* Delete confirm */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-black/5 rounded-2xl p-6 max-w-sm w-full shadow-lg">
            <h3 className="font-bold text-gray-800 text-lg mb-2">Delete Booking?</h3>
            <p className="text-gray-400 text-sm mb-6">This will permanently remove this booking record.</p>
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

function AddBookingModal({ cars, onClose, onSaved, prefilled }) {
  const [form, setForm] = useState({
    customerName: prefilled?.name || '',
    phone: prefilled?.phone || '',
    email: prefilled?.email || '',
    carId: prefilled?.carId?._id || prefilled?.carId || '',
    carName: prefilled?.carName || '',
    pickupDate: prefilled?.pickupDate || '',
    dropoffDate: prefilled?.dropoffDate || '',
    notes: prefilled?.message || '',
    status: 'confirmed',
  })
  const [loading, setLoading] = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const selectedCar = cars.find(c => c._id === form.carId) || (form.carId && typeof form.carId === 'object' ? form.carId : null)
  const days = form.pickupDate && form.dropoffDate
    ? Math.max(1, Math.ceil((new Date(form.dropoffDate) - new Date(form.pickupDate)) / 86400000))
    : 0
  const total = days && (selectedCar?.pricePerDay || prefilled?.carId?.pricePerDay) ? days * (selectedCar?.pricePerDay || prefilled?.carId?.pricePerDay) : 0

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await bookingsAPI.create({
        customerName: form.customerName,
        phone: form.phone,
        email: form.email,
        carId: form.carId,
        carName: selectedCar?.name || form.carName || prefilled?.carId?.name,
        pickupDate: form.pickupDate,
        dropoffDate: form.dropoffDate,
        totalDays: days,
        totalPrice: total,
        notes: form.notes,
        status: form.status,
      })
      toast.success('Booking created!')
      onSaved()
    } catch { toast.error('Failed to create booking') }
    finally { setLoading(false) }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white border border-black/5 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="flex items-center justify-between p-5" style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
          <h3 className="font-bold text-gray-800 text-lg">{prefilled ? 'Convert to Booking' : 'Add New Booking'}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors">✕</button>
        </div>
        <form onSubmit={submit} className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2"><label className="label">Customer Name *</label><input required value={form.customerName} onChange={e => set('customerName', e.target.value)} className="input" /></div>
            <div><label className="label">Phone</label><input value={form.phone} onChange={e => set('phone', e.target.value)} className="input" /></div>
            <div><label className="label">Email</label><input type="email" value={form.email} onChange={e => set('email', e.target.value)} className="input" /></div>
            <div className="col-span-2">
              <label className="label">Car *</label>
              <select required value={typeof form.carId === 'string' ? form.carId : ''} onChange={e => set('carId', e.target.value)} className="input">
                <option value="">Select a car…</option>
                {cars.map(c => <option key={c._id} value={c._id}>{c.name} — ₹{c.pricePerDay?.toLocaleString()}/day</option>)}
              </select>
            </div>
            <div><label className="label">Pickup Date *</label><input required type="date" value={form.pickupDate} onChange={e => set('pickupDate', e.target.value)} className="input" /></div>
            <div><label className="label">Return Date *</label><input required type="date" value={form.dropoffDate} onChange={e => set('dropoffDate', e.target.value)} className="input" /></div>
            <div className="col-span-2"><label className="label">Notes</label><textarea value={form.notes} onChange={e => set('notes', e.target.value)} rows={2} className="input resize-none" /></div>
          </div>

          {days > 0 && (
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-sm">
              <div className="flex justify-between text-gray-500"><span>Duration</span><span>{days} days</span></div>
              <div className="flex justify-between text-gray-500 mt-1"><span>Rate</span><span>₹{(selectedCar?.pricePerDay || prefilled?.carId?.pricePerDay)?.toLocaleString()}/day</span></div>
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
