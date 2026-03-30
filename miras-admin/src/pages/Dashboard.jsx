import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { analyticsAPI, inquiriesAPI, bookingsAPI } from '../utils/api'
import { Car, MessageSquare, Calendar, TrendingUp, ArrowUpRight, ArrowRight, Clock } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

function StatCard({ icon: Icon, label, value, delta, color, to }) {
  const colorMap = {
    gold: 'text-brand-gold bg-brand-gold/10 border-brand-gold/20',
    blue: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    green: 'text-green-400 bg-green-400/10 border-green-400/20',
    purple: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
  }
  return (
    <Link to={to || '#'} className="stat-card group block">
      <div className="flex items-start justify-between">
        <div className={`w-11 h-11 rounded-xl border flex items-center justify-center ${colorMap[color]}`}>
          <Icon size={20} />
        </div>
        {delta !== undefined && (
          <span className={`text-xs font-medium flex items-center gap-0.5 ${delta >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            <ArrowUpRight size={12} className={delta < 0 ? 'rotate-180' : ''} />
            {Math.abs(delta)}%
          </span>
        )}
      </div>
      <div className="mt-4">
        <p className="text-3xl font-display font-bold text-white">{value ?? '—'}</p>
        <p className="text-sm text-gray-500 mt-1">{label}</p>
      </div>
      <div className="mt-3 flex items-center gap-1 text-xs text-gray-600 group-hover:text-brand-gold transition-colors">
        <span>View details</span>
        <ArrowRight size={11} />
      </div>
    </Link>
  )
}

function RecentItem({ icon, title, sub, time, badge, badgeColor }) {
  const colors = {
    pending: 'bg-yellow-500/15 text-yellow-400',
    confirmed: 'bg-green-500/15 text-green-400',
    cancelled: 'bg-red-500/15 text-red-400',
    new: 'bg-blue-500/15 text-blue-400',
  }
  return (
    <div className="flex items-center gap-3 py-3 border-b border-dark-400/30 last:border-0">
      <div className="w-9 h-9 rounded-xl bg-dark-600 flex items-center justify-center text-base flex-shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate">{title}</p>
        <p className="text-xs text-gray-500 truncate">{sub}</p>
      </div>
      <div className="text-right flex-shrink-0">
        {badge && <span className={`badge ${colors[badgeColor] || colors.new} mb-1`}>{badge}</span>}
        <p className="text-[11px] text-gray-600 flex items-center gap-1"><Clock size={10} />{time}</p>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [recentInquiries, setRecentInquiries] = useState([])
  const [recentBookings, setRecentBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [dashRes, inqRes, bookRes] = await Promise.all([
          analyticsAPI.getDashboard().catch(() => ({ data: {} })),
          inquiriesAPI.getAll({ limit: 5, sort: '-createdAt' }).catch(() => ({ data: [] })),
          bookingsAPI.getAll({ limit: 5, sort: '-createdAt' }).catch(() => ({ data: [] })),
        ])
        setStats(dashRes.data)
        const inqs = inqRes.data?.inquiries || inqRes.data || []
        const books = bookRes.data?.bookings || bookRes.data || []
        setRecentInquiries(Array.isArray(inqs) ? inqs.slice(0, 5) : [])
        setRecentBookings(Array.isArray(books) ? books.slice(0, 5) : [])
      } catch {}
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-brand-gold/30 border-t-brand-gold rounded-full animate-spin" />
    </div>
  )

  const s = stats || {}

  return (
    <div className="space-y-6 page-enter">
      {/* Welcome bar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold text-white">Good {getTimeOfDay()} 👋</h2>
          <p className="text-gray-400 text-sm mt-0.5">Here's what's happening at Miras today</p>
        </div>
        <Link to="/cars/add" className="btn-gold flex items-center gap-2">
          <span>+ Add Car</span>
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Car} label="Total Cars" value={s.totalCars ?? 0} color="gold" to="/cars" />
        <StatCard icon={Calendar} label="Active Bookings" value={s.activeBookings ?? 0} delta={12} color="green" to="/bookings" />
        <StatCard icon={MessageSquare} label="New Inquiries" value={s.newInquiries ?? 0} delta={5} color="blue" to="/inquiries" />
        <StatCard icon={TrendingUp} label="Revenue (₹)" value={s.monthlyRevenue ? `${(s.monthlyRevenue/1000).toFixed(0)}k` : '—'} delta={8} color="purple" to="/analytics" />
      </div>

      {/* Secondary stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Cars Available', value: s.availableCars ?? 0, icon: '✅' },
          { label: 'Cars Booked', value: s.bookedCars ?? 0, icon: '🔒' },
          { label: 'Total Blogs', value: s.totalBlogs ?? 0, icon: '📝' },
        ].map(item => (
          <div key={item.label} className="card-raised p-4 flex items-center gap-4">
            <div className="text-2xl">{item.icon}</div>
            <div>
              <p className="text-xl font-display font-bold text-white">{item.value}</p>
              <p className="text-xs text-gray-500">{item.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Inquiries */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white">Recent Inquiries</h3>
            <Link to="/inquiries" className="text-xs text-brand-gold hover:underline flex items-center gap-1">
              View all <ArrowRight size={11} />
            </Link>
          </div>
          {recentInquiries.length === 0 ? (
            <p className="text-gray-600 text-sm text-center py-6">No inquiries yet</p>
          ) : recentInquiries.map((inq, i) => (
            <RecentItem
              key={inq._id || i}
              icon="📩"
              title={inq.name || 'Customer'}
              sub={inq.message?.slice(0, 50) || inq.phone || ''}
              time={inq.createdAt ? formatDistanceToNow(new Date(inq.createdAt), { addSuffix: true }) : ''}
              badge={inq.status || 'new'}
              badgeColor={inq.status || 'new'}
            />
          ))}
        </div>

        {/* Recent Bookings */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white">Recent Bookings</h3>
            <Link to="/bookings" className="text-xs text-brand-gold hover:underline flex items-center gap-1">
              View all <ArrowRight size={11} />
            </Link>
          </div>
          {recentBookings.length === 0 ? (
            <p className="text-gray-600 text-sm text-center py-6">No bookings yet</p>
          ) : recentBookings.map((book, i) => (
            <RecentItem
              key={book._id || i}
              icon="🚗"
              title={book.customerName || book.name || 'Customer'}
              sub={book.carName || book.car?.name || `${book.days || ''} days`}
              time={book.createdAt ? formatDistanceToNow(new Date(book.createdAt), { addSuffix: true }) : ''}
              badge={book.status || 'pending'}
              badgeColor={book.status || 'pending'}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function getTimeOfDay() {
  const h = new Date().getHours()
  if (h < 12) return 'morning'
  if (h < 17) return 'afternoon'
  return 'evening'
}
