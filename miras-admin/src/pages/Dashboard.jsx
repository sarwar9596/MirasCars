import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { analyticsAPI, inquiriesAPI } from '../utils/api'
import { Car, MessageSquare, Calendar, TrendingUp, ArrowUpRight, ArrowRight, Clock } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { useAuth } from '../context/AuthContext'

function StatCard({ icon: Icon, label, value, delta, color, to }) {
  const colorMap = {
    green:  { bg: 'rgba(34,197,94,0.1)',  text: '#22C55E', border: 'rgba(34,197,94,0.2)' },
    blue:   { bg: 'rgba(59,130,246,0.1)', text: '#3B82F6', border: 'rgba(59,130,246,0.2)' },
    primary:{ bg: 'rgba(31,122,77,0.1)',  text: '#1F7A4D', border: 'rgba(31,122,77,0.2)' },
    amber:  { bg: 'rgba(245,158,11,0.1)', text: '#F59E0B', border: 'rgba(245,158,11,0.2)' },
  }
  const c = colorMap[color] || colorMap.green
  return (
    <Link to={to || '#'} className="stat-card group block">
      <div className="flex items-start justify-between mb-4">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.text }}>
          <Icon size={20} />
        </div>
        {delta !== undefined && (
          <span className="flex items-center gap-0.5 text-xs font-medium" style={{ color: delta >= 0 ? '#22C55E' : '#EF4444' }}>
            <ArrowUpRight size={12} style={{ transform: delta < 0 ? 'rotate(180deg)' : 'none' }} />
            {Math.abs(delta)}%
          </span>
        )}
      </div>
      <div>
        <p className="text-3xl font-bold" style={{ color: '#1A1A1A' }}>{value ?? '—'}</p>
        <p className="text-sm mt-1" style={{ color: '#6B7280' }}>{label}</p>
      </div>
      <div className="mt-3 flex items-center gap-1 text-xs transition-colors cursor-pointer group-hover:text-[#1F7A4D]" style={{ color: '#9CA3AF' }}>
        <span>View details</span>
        <ArrowRight size={11} />
      </div>
    </Link>
  )
}

function RecentItem({ icon, title, sub, time, badge, badgeColor }) {
  const colors = {
    pending:   { bg: 'rgba(245,158,11,0.1)', text: '#F59E0B' },
    confirmed: { bg: 'rgba(34,197,94,0.1)',  text: '#22C55E' },
    cancelled: { bg: 'rgba(239,68,68,0.1)',  text: '#EF4444' },
    new:       { bg: 'rgba(59,130,246,0.1)', text: '#3B82F6' },
    replied:   { bg: 'rgba(31,122,77,0.1)',  text: '#1F7A4D' },
    closed:    { bg: 'rgba(107,114,128,0.1)',text: '#6B7280' },
  }
  const c = colors[badgeColor] || colors.new
  return (
    <div className="flex items-center gap-3 py-3" style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
      <div className="w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0" style={{ background: '#F5F7F6' }}>{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate" style={{ color: '#1A1A1A' }}>{title}</p>
        <p className="text-xs truncate" style={{ color: '#9CA3AF' }}>{sub}</p>
      </div>
      <div className="text-right flex-shrink-0">
        {badge && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold mb-1" style={{ background: c.bg, color: c.text }}>
            {badge}
          </span>
        )}
        <p className="text-[11px] flex items-center gap-1" style={{ color: '#9CA3AF' }}>
          <Clock size={10} />{time}
        </p>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { isAuthenticated } = useAuth()
  const [stats, setStats] = useState(null)
  const [recentInquiries, setRecentInquiries] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false)
      return
    }
    const load = async () => {
      try {
        const [dashRes, inqRes] = await Promise.all([
          analyticsAPI.getDashboard().catch(() => ({ data: {} })),
          inquiriesAPI.getAll({ limit: 5 }).catch(() => ({ data: [] })),
        ])
        setStats(dashRes.data)
        const inqs = inqRes.data?.data || inqRes.data || []
        setRecentInquiries(Array.isArray(inqs) ? inqs.slice(0, 5) : [])
      } catch {}
      setLoading(false)
    }
    load()
  }, [isAuthenticated])

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: 'rgba(31,122,77,0.2)', borderTopColor: '#1F7A4D' }} />
    </div>
  )

  const s = stats || {}

  return (
    <div className="space-y-6 page-enter">
      {/* Welcome bar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: '#1A1A1A' }}>Good {getTimeOfDay()} 👋</h2>
          <p className="text-sm mt-0.5" style={{ color: '#9CA3AF' }}>Here's what's happening at Miras today</p>
        </div>
        <Link to="/cars/add" className="btn-primary">
          <span>+ Add Car</span>
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Car} label="Total Cars" value={s.totalCars ?? 0} color="primary" to="/cars" />
        <StatCard icon={Calendar} label="Active Bookings" value={s.activeBookings ?? 0} delta={12} color="green" to="/bookings" />
        <StatCard icon={MessageSquare} label="New Inquiries" value={s.newInquiries ?? 0} delta={5} color="blue" to="/inquiries" />
        <StatCard icon={TrendingUp} label="Revenue (₹)" value={s.monthlyRevenue ? `${(s.monthlyRevenue/1000).toFixed(0)}k` : '—'} delta={8} color="amber" to="/analytics" />
      </div>

      {/* Secondary stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Cars Available', value: s.availableCars ?? 0, icon: '🚗' },
          { label: 'Cars Booked', value: s.bookedCars ?? 0, icon: '🔒' },
          { label: 'Total Blogs', value: s.totalBlogs ?? 0, icon: '📝' },
        ].map(item => (
          <div key={item.label} className="card-raised p-4 flex items-center gap-4">
            <div className="text-2xl">{item.icon}</div>
            <div>
              <p className="text-xl font-bold" style={{ color: '#1A1A1A' }}>{item.value}</p>
              <p className="text-xs" style={{ color: '#9CA3AF' }}>{item.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Inquiries */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold" style={{ color: '#1A1A1A' }}>Recent Inquiries</h3>
            <Link to="/inquiries" className="text-xs font-medium flex items-center gap-1 transition-colors" style={{ color: '#1F7A4D' }}>
              View all <ArrowRight size={11} />
            </Link>
          </div>
          {recentInquiries.length === 0 ? (
            <p className="text-sm text-center py-6" style={{ color: '#9CA3AF' }}>No inquiries yet</p>
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

        {/* Placeholder card */}
        <div className="card p-5 flex items-center justify-center">
          <div className="text-center">
            <p className="text-sm font-medium" style={{ color: '#1A1A1A' }}>More features coming soon</p>
            <p className="text-xs mt-1" style={{ color: '#9CA3AF' }}>Stay tuned for enhanced analytics</p>
          </div>
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
