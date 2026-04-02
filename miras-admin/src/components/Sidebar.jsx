import { NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  LayoutDashboard, Car, MessageSquare, BookOpen,
  BarChart3, Settings, LogOut, Calendar, ChevronRight, X
} from 'lucide-react'

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/cars', icon: Car, label: 'Fleet / Cars' },
  { to: '/bookings', icon: Calendar, label: 'Bookings' },
  { to: '/inquiries', icon: MessageSquare, label: 'Inquiries' },
  { to: '/blogs', icon: BookOpen, label: 'Blog Posts' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/settings', icon: Settings, label: 'Settings' },
]

export default function Sidebar({ collapsed, onToggle }) {
  const { logout, admin } = useAuth()
  const location = useLocation()

  const isActive = (to) =>
    to === '/' ? location.pathname === '/' : location.pathname.startsWith(to)

  return (
    <aside className={`
      fixed left-0 top-0 h-screen
      bg-white flex flex-col z-40
      transition-all duration-300
      shadow-[2px_0_12px_rgba(0,0,0,0.04)]
      border-r border-black/5
      ${collapsed ? 'w-[72px]' : 'w-64'}
    `}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 min-h-[72px]"
        style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
        {/* Green gradient icon */}
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 shadow-[0_4px_12px_rgba(31,122,77,0.25)]"
          style={{ background: 'linear-gradient(135deg, #1F7A4D, #2E8B57)' }}>
          <span className="text-white font-bold text-base">M</span>
        </div>
        {!collapsed && (
          <div>
            <p className="font-bold text-base leading-tight" style={{ color: '#1A1A1A' }}>Miras</p>
            <p className="text-[10px] uppercase tracking-widest" style={{ color: '#9CA3AF', letterSpacing: '2px' }}>Car Rental</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label }) => {
          const active = isActive(to)
          return (
            <NavLink
              key={to}
              to={to}
              title={collapsed ? label : undefined}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group
                ${active
                  ? 'nav-item active'
                  : 'nav-item'
                }
                ${collapsed ? 'justify-center' : ''}
              `}
            >
              <Icon size={18} className="flex-shrink-0" />
              {!collapsed && (
                <>
                  <span className="text-sm font-medium flex-1">{label}</span>
                  {active && <ChevronRight size={14} className="opacity-60" />}
                </>
              )}
            </NavLink>
          )
        })}
      </nav>

      {/* Admin info + logout */}
      <div className="p-3" style={{ borderTop: '1px solid rgba(0,0,0,0.05)' }}>
        {!collapsed && (
          <div className="flex items-center gap-2.5 px-2 py-2 mb-2 rounded-xl" style={{ background: '#F5F7F6' }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-[0_2px_8px_rgba(31,122,77,0.2)]"
              style={{ background: 'linear-gradient(135deg, #1F7A4D, #2E8B57)' }}>
              <span className="text-white text-xs font-bold">
                {(admin?.name || 'A').charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold truncate" style={{ color: '#1A1A1A' }}>{admin?.name || 'Admin'}</p>
              <p className="text-[11px] truncate" style={{ color: '#9CA3AF' }}>{admin?.email || ''}</p>
            </div>
          </div>
        )}
        <button
          onClick={logout}
          title={collapsed ? 'Logout' : undefined}
          className={`
            w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
            text-sm font-medium transition-all duration-200
            ${collapsed ? 'justify-center' : ''}
          `}
          style={{ color: '#9CA3AF' }}
          onMouseEnter={e => { e.currentTarget.style.color = '#EF4444'; e.currentTarget.style.background = 'rgba(239,68,68,0.06)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = '#9CA3AF'; e.currentTarget.style.background = 'transparent'; }}
        >
          <LogOut size={17} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-[76px] w-6 h-6 rounded-full bg-white border border-black/10 shadow-[0_2px_8px_rgba(0,0,0,0.1)] flex items-center justify-center transition-all duration-200 z-50"
        style={{ color: '#9CA3AF' }}
        onMouseEnter={e => { e.currentTarget.style.color = '#1F7A4D'; e.currentTarget.style.borderColor = 'rgba(31,122,77,0.3)'; }}
        onMouseLeave={e => { e.currentTarget.style.color = '#9CA3AF'; e.currentTarget.style.borderColor = 'rgba(0,0,0,0.1)'; }}
      >
        <ChevronRight size={12} className={`transition-transform ${collapsed ? '' : 'rotate-180'}`} />
      </button>
    </aside>
  )
}
