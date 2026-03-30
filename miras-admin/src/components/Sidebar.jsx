import { NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  LayoutDashboard, Car, MessageSquare, BookOpen,
  BarChart3, Settings, LogOut, Calendar, ChevronRight
} from 'lucide-react'

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard', exact: true },
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

  const isActive = (to, exact) => exact ? location.pathname === to : location.pathname.startsWith(to)

  return (
    <aside className={`
      fixed left-0 top-0 h-screen bg-dark-800 border-r border-dark-400/40
      flex flex-col z-40 transition-all duration-300
      ${collapsed ? 'w-[72px]' : 'w-64'}
    `}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-dark-400/40 min-h-[72px]">
        <div className="w-9 h-9 rounded-xl bg-gold-gradient flex items-center justify-center flex-shrink-0 shadow-gold">
          <span className="text-dark-900 font-bold text-base">M</span>
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <p className="font-display font-bold text-white text-base leading-tight">Miras</p>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest">Car Rental</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label, exact }) => {
          const active = isActive(to, exact)
          return (
            <NavLink
              key={to}
              to={to}
              title={collapsed ? label : undefined}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group
                ${active
                  ? 'text-brand-gold bg-brand-gold/10 border border-brand-gold/20'
                  : 'text-gray-400 hover:text-brand-gold hover:bg-brand-gold/5'
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
      <div className="border-t border-dark-400/40 p-3">
        {!collapsed && (
          <div className="flex items-center gap-2.5 px-2 py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-brand-gold/20 border border-brand-gold/30 flex items-center justify-center flex-shrink-0">
              <span className="text-brand-gold text-xs font-bold">
                {(admin?.name || 'A').charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-white truncate">{admin?.name || 'Admin'}</p>
              <p className="text-[11px] text-gray-500 truncate">{admin?.email || ''}</p>
            </div>
          </div>
        )}
        <button
          onClick={logout}
          title={collapsed ? 'Logout' : undefined}
          className={`
            w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
            text-gray-500 hover:text-red-400 hover:bg-red-500/10
            transition-all duration-200 text-sm
            ${collapsed ? 'justify-center' : ''}
          `}
        >
          <LogOut size={17} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-dark-500 border border-dark-400 text-gray-400 hover:text-brand-gold hover:border-brand-gold/50 transition-all duration-200 flex items-center justify-center z-50"
      >
        <ChevronRight size={12} className={`transition-transform ${collapsed ? '' : 'rotate-180'}`} />
      </button>
    </aside>
  )
}
