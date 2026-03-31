import { useState, useEffect } from 'react'
import { bookingsAPI, carsAPI } from '../utils/api'
import { Plus, Search, Trash2, Edit2, ExternalLink, Calendar, User, Car, ChevronDown } from 'lucide-react'
import { format, formatDistanceToNow } from 'date-fns'
import toast from 'react-hot-toast'

const STATUS_STYLES = {
  pending:   'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
  confirmed: 'bg-green-500/15 text-green-400 border-green-500/30',
  ongoing:   'bg-blue-500/15 text-blue-400 border-blue-500/30',
  completed: 'bg-gray-500/15 text-gray-400 border-gray-500/30',
  cancelled: 'bg-red-500/15 text-red-400 border-red-500/30',
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
    b.customerPhone?.includes(search) ||
    b.carName?.toLowerCase().includes(search.toLowerCase())
  )

  const openWhatsApp = (phone, name, details) => {
    const clean = phone?.replace(/\D/g, '')
    const text = encodeURIComponent(`Hi ${name}, your booking at Miras Car Rental has been confirmed! ${details}`)
    window.open(`https://wa.me/${clean}?text=${text}`, '_blank')
  }

  // Summary counts
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
            className={`card p-3 text-center transition-all hover:border-brand-gold/30 ${filter === s ? 'border-brand-gold/40' : ''}`}>
            <p className="text-xl font-bold text-white">{counts[s]}</p>
            <p className="text-xs text-gray-500 capitalize mt-0.5">{s}</p>
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
          <input placeholder="Search customer or car…" value={search} onChange={e => setSearch(e.target.value)} className="input pl-10 py-2.5" />
        </div>
        <button onClick={() => setShowAdd(true)} className="btn-gold flex items-center gap-2">
          <Plus size={16} /> Add Booking
        </button>
      </div>

      {/* All/filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {['all', ...ALL_STATUSES].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-all ${filter === s ? 'bg-brand-gold text-dark-900' : 'bg-dark-600 text-gray-400 hover:text-white border border-dark-400'}`}>
            {s}
          </button>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-brand-gold/30 border-t-brand-gold rounded-full animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <div className="card p-16 text-center">
          <div className="text-5xl mb-4">📋</div>
          <p className="text-white font-semibold">No bookings yet</p>
          <p className="text-gray-500 text-sm mt-1">Bookings from your website will appear here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(book => (
            <div key={book._id} className={`card overflow-hidden ${book.status === 'pending' ? 'border-yellow-500/30' : ''}`}>
              <div
                className="flex items-center gap-4 p-4 cursor-pointer hover:bg-dark-600/20 transition-colors"
                onClick={() => setExpanded(expanded === book._id ? null : book._id)}
              >
                <div className="w-10 h-10 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-green-400 text-sm font-bold">{(book.customerName || '?').charAt(0)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-white">{book.customerName || 'Customer'}</p>
                    {book.status === 'pending' && <span className="w-2 h-2 rounded-full bg-yellow-400 notif-dot" />}
                  </div>
                  <p className="text-sm text-gray-400">{book.carName || book.car?.name || 'Car'} · {book.days || '—'} days</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <p className="text-brand-gold font-semibold">₹{book.totalAmount?.toLocaleString() || '—'}</p>
                  <span className={`badge border ${STATUS_STYLES[book.status] || STATUS_STYLES.pending}`}>{book.status}</span>
                  <ChevronDown size={16} className={`text-gray-500 transition-transform ${expanded === book._id ? 'rotate-180' : ''}`} />
                </div>
              </div>

              {expanded === book._id && (
                <div className="border-t border-dark-400/40 p-4 bg-dark-600/20 space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div><p className="label">Customer</p><p className="text-sm text-white">{book.customerName}</p></div>
                    <div><p className="label">Phone</p><p className="text-sm text-white">{book.customerPhone || '—'}</p></div>
                    <div><p className="label">Email</p><p className="text-sm text-white">{book.customerEmail || '—'}</p></div>
                    <div><p className="label">Car</p><p className="text-sm text-white">{book.carName || '—'}</p></div>
                    <div><p className="label">Pickup</p><p className="text-sm text-white">{book.pickupDate ? format(new Date(book.pickupDate), 'dd MMM yyyy') : '—'}</p></div>
                    <div><p className="label">Return</p><p className="text-sm text-white">{book.returnDate ? format(new Date(book.returnDate), 'dd MMM yyyy') : '—'}</p></div>
                    <div><p className="label">Duration</p><p className="text-sm text-white">{book.days} days</p></div>
                    <div><p className="label">Total</p><p className="text-sm text-brand-gold font-semibold">₹{book.totalAmount?.toLocaleString()}</p></div>
                  </div>

                  {book.notes && (
                    <div>
                      <p className="label">Notes</p>
                      <p className="text-sm text-gray-300 bg-dark-700/50 rounded-xl p-3">{book.notes}</p>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2">
                    <select value={book.status} onChange={e => changeStatus(book._id, e.target.value)}
                      className="bg-dark-600 border border-dark-400 text-sm text-gray-300 rounded-xl px-3 py-2 outline-none">
                      {ALL_STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
                    </select>
                    {book.customerPhone && (
                      <button onClick={() => openWhatsApp(book.customerPhone, book.customerName, `${book.carName}, ${book.days} days`)}
                        className="flex items-center gap-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/30 px-4 py-2 rounded-xl text-sm transition-all">
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
      {showAdd && <AddBookingModal cars={cars} onClose={() => setShowAdd(false)} onSaved={() => { setShowAdd(false); fetchAll() }} />}

      {/* Delete confirm */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-surface-raised border border-dark-400 rounded-2xl p-6 max-w-sm w-full">
            <h3 className="font-display font-bold text-white text-lg mb-2">Delete Booking?</h3>
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

function AddBookingModal({ cars, onClose, onSaved }) {
  const [form, setForm] = useState({
    customerName: '', customerPhone: '', customerEmail: '',
    carId: '', pickupDate: '', returnDate: '', notes: '', status: 'confirmed'
  })
  const [loading, setLoading] = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const selectedCar = cars.find(c => c._id === form.carId)
  const days = form.pickupDate && form.returnDate
    ? Math.max(1, Math.ceil((new Date(form.returnDate) - new Date(form.pickupDate)) / 86400000))
    : 0
  const total = days && selectedCar?.pricePerDay ? days * selectedCar.pricePerDay : 0

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await bookingsAPI.create({
        ...form,
        carName: selectedCar?.name,
        days,
        totalAmount: total,
      })
      toast.success('Booking created!')
      onSaved()
    } catch { toast.error('Failed to create booking') }
    finally { setLoading(false) }
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-surface-raised border border-dark-400 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-dark-400/50">
          <h3 className="font-display font-bold text-white text-lg">Add New Booking</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-white text-xl">✕</button>
        </div>
        <form onSubmit={submit} className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2"><label className="label">Customer Name *</label><input required value={form.customerName} onChange={e => set('customerName', e.target.value)} className="input" /></div>
            <div><label className="label">Phone</label><input value={form.customerPhone} onChange={e => set('customerPhone', e.target.value)} className="input" /></div>
            <div><label className="label">Email</label><input type="email" value={form.customerEmail} onChange={e => set('customerEmail', e.target.value)} className="input" /></div>
            <div className="col-span-2">
              <label className="label">Car *</label>
              <select required value={form.carId} onChange={e => set('carId', e.target.value)} className="input">
                <option value="">Select a car…</option>
                {cars.map(c => <option key={c._id} value={c._id}>{c.name} — ₹{c.pricePerDay}/day</option>)}
              </select>
            </div>
            <div><label className="label">Pickup Date *</label><input required type="date" value={form.pickupDate} onChange={e => set('pickupDate', e.target.value)} className="input" /></div>
            <div><label className="label">Return Date *</label><input required type="date" value={form.returnDate} onChange={e => set('returnDate', e.target.value)} className="input" /></div>
            <div className="col-span-2"><label className="label">Notes</label><textarea value={form.notes} onChange={e => set('notes', e.target.value)} rows={2} className="input resize-none" /></div>
          </div>

          {days > 0 && (
            <div className="bg-brand-gold/10 border border-brand-gold/30 rounded-xl p-4 text-sm">
              <div className="flex justify-between text-gray-300"><span>Duration</span><span>{days} days</span></div>
              <div className="flex justify-between text-gray-300 mt-1"><span>Rate</span><span>₹{selectedCar?.pricePerDay?.toLocaleString()}/day</span></div>
              <div className="flex justify-between text-brand-gold font-bold text-base mt-2 pt-2 border-t border-brand-gold/20"><span>Total</span><span>₹{total.toLocaleString()}</span></div>
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="btn-outline flex-1">Cancel</button>
            <button type="submit" disabled={loading} className="btn-gold flex-1 flex items-center justify-center gap-2">
              {loading ? <><div className="w-4 h-4 border-2 border-dark-900/30 border-t-dark-900 rounded-full animate-spin" />Saving…</> : 'Create Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
