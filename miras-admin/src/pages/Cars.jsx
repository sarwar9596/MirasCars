import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { carsAPI } from '../utils/api'
import { Plus, Search, Edit2, Trash2, Eye, Filter } from 'lucide-react'
import toast from 'react-hot-toast'

const CATEGORIES = ['All', 'SUV', 'Sedan', 'Hatchback', 'Motorbike', 'Luxury', 'MUV']
const STATUS_COLORS = {
  available: 'bg-green-500/15 text-green-400',
  booked: 'bg-yellow-500/15 text-yellow-400',
  maintenance: 'bg-red-500/15 text-red-400',
}

export default function Cars() {
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [deleteId, setDeleteId] = useState(null)

  const fetchCars = async () => {
    try {
      const res = await carsAPI.getAll({ category: category !== 'All' ? category : undefined })
      setCars(res.data?.data || [])
    } catch {
      toast.error('Failed to load cars')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchCars() }, [category])

  const handleDelete = async (id) => {
    try {
      await carsAPI.delete(id)
      toast.success('Car removed from fleet')
      setCars(c => c.filter(x => x._id !== id))
    } catch {
      toast.error('Delete failed')
    }
    setDeleteId(null)
  }

  const filtered = cars.filter(c =>
    !search || c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.model?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-5 page-enter">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1">
          <div className="relative flex-1 max-w-xs">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              placeholder="Search cars…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input pl-10 py-2.5"
            />
          </div>
        </div>
        <Link to="/cars/add" className="btn-gold flex items-center gap-2">
          <Plus size={16} />
          <span>Add Car</span>
        </Link>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              category === cat
                ? 'bg-brand-gold text-dark-900'
                : 'bg-dark-600 text-gray-400 hover:text-white border border-dark-400'
            }`}
          >{cat}</button>
        ))}
      </div>

      {/* Cars Grid */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-2 border-brand-gold/30 border-t-brand-gold rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="card p-16 text-center">
          <div className="text-5xl mb-4">🚗</div>
          <p className="text-white font-semibold mb-1">No cars found</p>
          <p className="text-gray-500 text-sm mb-4">Add your first car to get started</p>
          <Link to="/cars/add" className="btn-gold inline-flex items-center gap-2">
            <Plus size={15} /> Add First Car
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(car => (
            <CarCard key={car._id} car={car} onDelete={id => setDeleteId(id)} />
          ))}
        </div>
      )}

      {/* Delete confirm modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-surface-raised border border-dark-400 rounded-2xl p-6 max-w-sm w-full shadow-card-lg">
            <h3 className="font-display font-bold text-white text-lg mb-2">Remove Car?</h3>
            <p className="text-gray-400 text-sm mb-6">This will permanently remove the car from your fleet and website. This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="btn-outline flex-1">Cancel</button>
              <button onClick={() => handleDelete(deleteId)} className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-xl font-semibold transition-colors">
                Yes, Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function CarCard({ car, onDelete }) {
  const carStatus = car.isAvailable === false ? 'booked' : 'available'
  const statusColor = STATUS_COLORS[carStatus] || STATUS_COLORS.available
  const mainImage = car.images?.[0] || car.image || null

  return (
    <div className="card overflow-hidden group hover:border-brand-gold/30 transition-all duration-300">
      {/* Image */}
      <div className="h-44 bg-dark-700 relative overflow-hidden">
        {mainImage ? (
          <img src={mainImage} alt={car.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl">🚗</div>
        )}
        <div className="absolute top-3 right-3">
          <span className={`badge ${statusColor}`}>{carStatus === 'booked' ? 'Booked' : 'Available'}</span>
        </div>
        <div className="absolute top-3 left-3">
          <span className="badge bg-dark-900/70 text-gray-300 backdrop-blur-sm">{car.category || 'SUV'}</span>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-display font-bold text-white">{car.name || 'Unnamed Car'}</h3>
            <p className="text-sm text-gray-500">{car.modelYear || '—'} · {car.transmission || 'Manual'}</p>
          </div>
          <div className="text-right">
            <p className="text-brand-gold font-bold text-lg">₹{car.pricePerDay?.toLocaleString() || '—'}</p>
            <p className="text-xs text-gray-600">/day</p>
          </div>
        </div>

        {/* Details row */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[
            { icon: '💺', label: `${car.seats || '—'} seats` },
            { icon: '📏', label: car.mileage || '—' },
            { icon: '🔧', label: car.lastServiceDate ? new Date(car.lastServiceDate).toLocaleDateString('en-IN', { month: 'short', year: '2-digit' }) : '—' },
          ].map(item => (
            <div key={item.label} className="bg-dark-700/50 rounded-lg p-2 text-center">
              <div className="text-base">{item.icon}</div>
              <p className="text-[11px] text-gray-400 mt-0.5">{item.label}</p>
            </div>
          ))}
        </div>

        {car.bookedUntil && (
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg px-3 py-1.5 mb-3 text-xs text-yellow-400 flex items-center gap-1.5">
            🔒 Booked until {new Date(car.bookedUntil).toLocaleDateString('en-IN')}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 pt-1">
          <Link to={`/cars/edit/${car._id}`} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-dark-600 hover:bg-brand-gold/10 hover:text-brand-gold text-gray-400 text-sm transition-all">
            <Edit2 size={13} /> Edit
          </Link>
          <button
            onClick={() => onDelete(car._id)}
            className="w-10 h-9 flex items-center justify-center rounded-xl bg-dark-600 hover:bg-red-500/10 hover:text-red-400 text-gray-500 transition-all"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
