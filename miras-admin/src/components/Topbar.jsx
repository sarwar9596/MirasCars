import { useState, useRef, useEffect } from 'react'
import { Bell, Search, X, Clock } from 'lucide-react'
import { useNotifications } from '../context/NotificationContext'
import { formatDistanceToNow } from 'date-fns'

export default function Topbar({ title, subtitle }) {
  const { notifications, unreadCount, markAllRead, clearAll } = useNotifications()
  const [notifOpen, setNotifOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setNotifOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const openNotif = () => {
    setNotifOpen(o => !o)
    if (!notifOpen) markAllRead()
  }

  const typeColors = {
    inquiry: 'bg-blue-500/20 text-blue-400',
    booking: 'bg-green-500/20 text-green-400',
  }
  const typeIcons = { inquiry: '📩', booking: '🚗' }

  return (
    <header className="h-[72px] flex items-center justify-between px-6 border-b border-dark-400/40 bg-dark-800/80 backdrop-blur-sm sticky top-0 z-30">
      <div>
        <h1 className="text-lg font-display font-bold text-white">{title}</h1>
        {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        {/* Search hint */}
        <div className="hidden md:flex items-center gap-2 bg-dark-600 border border-dark-400 rounded-xl px-3 py-2 text-gray-500 text-sm cursor-pointer hover:border-brand-gold/40 transition-colors w-52">
          <Search size={14} />
          <span>Quick search…</span>
          <kbd className="ml-auto text-[10px] bg-dark-500 px-1.5 py-0.5 rounded text-gray-600">⌘K</kbd>
        </div>

        {/* Notifications */}
        <div className="relative" ref={ref}>
          <button
            onClick={openNotif}
            className="relative w-10 h-10 rounded-xl bg-dark-600 border border-dark-400 hover:border-brand-gold/40 flex items-center justify-center text-gray-400 hover:text-brand-gold transition-all duration-200"
          >
            <Bell size={17} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4.5 h-4.5 min-w-[18px] min-h-[18px] bg-brand-gold rounded-full text-[10px] text-dark-900 font-bold flex items-center justify-center notif-dot">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-12 w-80 bg-surface-raised border border-dark-400 rounded-2xl shadow-card-lg overflow-hidden z-50">
              <div className="flex items-center justify-between px-4 py-3 border-b border-dark-400/50">
                <span className="text-sm font-semibold text-white">Notifications</span>
                <button onClick={clearAll} className="text-xs text-gray-500 hover:text-red-400 transition-colors">Clear all</button>
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-dark-400/30">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center text-gray-600 text-sm">No notifications yet</div>
                ) : notifications.map(n => (
                  <div key={n.id} className="flex items-start gap-3 px-4 py-3 hover:bg-dark-600/30 transition-colors">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0 ${typeColors[n.type]}`}>
                      {typeIcons[n.type]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white">{n.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5 truncate">{n.message}</p>
                      <div className="flex items-center gap-1 mt-1 text-[11px] text-gray-600">
                        <Clock size={10} />
                        <span>{formatDistanceToNow(n.time, { addSuffix: true })}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Date */}
        <div className="hidden lg:block text-right">
          <p className="text-xs text-gray-500">
            {new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
          </p>
        </div>
      </div>
    </header>
  )
}
