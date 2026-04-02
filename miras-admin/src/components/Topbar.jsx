import { useState, useRef, useEffect } from 'react'
import { Bell, Search, X, Clock } from 'lucide-react'
import { useNotifications } from '../context/NotificationContext'
import { formatDistanceToNow } from 'date-fns'

export default function Topbar({ title, subtitle }) {
  const { notifications, unreadCount, markAllRead, clearAll } = useNotifications()
  const [notifOpen, setNotifOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target))
        setNotifOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const openNotif = () => {
    setNotifOpen((o) => !o)
    if (!notifOpen) markAllRead()
  }

  const typeColors = {
    inquiry: 'rgba(59,130,246,0.1)',
    booking: 'rgba(34,197,94,0.1)',
  }
  const typeTextColors = {
    inquiry: '#3B82F6',
    booking: '#22C55E',
  }
  const typeIcons = { inquiry: '📩', booking: '🚗' }

  return (
    <header className='h-[68px] flex items-center justify-between px-6 border-b bg-white z-30'
      style={{ borderColor: 'rgba(0,0,0,0.05)', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
      <div>
        <h1 className='text-base font-bold' style={{ color: '#1A1A1A' }}>
          {title}
        </h1>
        {subtitle && (
          <p className='text-xs' style={{ color: '#9CA3AF' }}>{subtitle}</p>
        )}
      </div>

      <div className='flex items-center gap-3'>
        {/* Search */}
        <div className='hidden md:flex items-center gap-2 rounded-xl px-3 py-2 text-sm cursor-pointer transition-colors'
          style={{ background: '#F1F3F2', color: '#9CA3AF', border: '1.5px solid transparent' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(31,122,77,0.3)'; e.currentTarget.style.color = '#6B7280'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.color = '#9CA3AF'; }}>
          <Search size={14} />
          <span>Quick search…</span>
          <kbd className='ml-2 text-[10px] px-1.5 py-0.5 rounded' style={{ background: 'rgba(0,0,0,0.06)', color: '#9CA3AF' }}>
            ⌘K
          </kbd>
        </div>

        {/* Notifications */}
        <div className='relative' ref={ref}>
          <button
            onClick={openNotif}
            className='relative w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200'
            style={{ background: '#F1F3F2', color: '#6B7280' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(31,122,77,0.08)'; e.currentTarget.style.color = '#1F7A4D'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#F1F3F2'; e.currentTarget.style.color = '#6B7280'; }}>
            <Bell size={16} />
            {unreadCount > 0 && (
              <span className='absolute -top-1 -right-1 w-4.5 h-4.5 min-w-[18px] min-h-[18px] rounded-full text-[10px] font-bold flex items-center justify-center notif-dot text-white'
                style={{ background: 'linear-gradient(135deg, #1F7A4D, #2E8B57)' }}>
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className='absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.1)] border border-black/5 overflow-hidden z-50'>
              <div className='flex items-center justify-between px-4 py-3' style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                <span className='text-sm font-bold' style={{ color: '#1A1A1A' }}>Notifications</span>
                <button onClick={clearAll} className='text-xs transition-colors' style={{ color: '#9CA3AF' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#EF4444'}
                  onMouseLeave={e => e.currentTarget.style.color = '#9CA3AF'}>
                  Clear all
                </button>
              </div>

              <div className='max-h-80 overflow-y-auto' style={{ borderTop: '1px solid rgba(0,0,0,0.03)' }}>
                {notifications.length === 0 ? (
                  <div className='py-8 text-center text-sm' style={{ color: '#9CA3AF' }}>No notifications yet</div>
                ) : (
                  notifications.map((n) => (
                    <div key={n.id} className='flex items-start gap-3 px-4 py-3 transition-colors cursor-pointer'
                      style={{ borderBottom: '1px solid rgba(0,0,0,0.03)' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#F5F7F6'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <div className='w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0'
                        style={{ background: typeColors[n.type], color: typeTextColors[n.type] }}>
                        {typeIcons[n.type]}
                      </div>
                      <div className='flex-1 min-w-0'>
                        <p className='text-sm font-medium' style={{ color: '#1A1A1A' }}>{n.title}</p>
                        <p className='text-xs truncate mt-0.5' style={{ color: '#9CA3AF' }}>{n.message}</p>
                        <div className='flex items-center gap-1 mt-1 text-[11px]' style={{ color: '#9CA3AF' }}>
                          <Clock size={10} />
                          <span>{formatDistanceToNow(n.time, { addSuffix: true })}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Date */}
        <div className='hidden lg:block text-right'>
          <p className='text-xs' style={{ color: '#9CA3AF' }}>
            {new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
          </p>
        </div>
      </div>
    </header>
  )
}
