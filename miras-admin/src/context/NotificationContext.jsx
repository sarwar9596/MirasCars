import { createContext, useContext, useState, useEffect, useRef } from 'react'
import { inquiriesAPI, bookingsAPI } from '../utils/api'
import toast from 'react-hot-toast'

const NotificationContext = createContext(null)

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const prevInquiryCount = useRef(null)
  const prevBookingCount = useRef(null)

  const checkForNew = async () => {
    try {
      const [inqRes, bookRes] = await Promise.all([
        inquiriesAPI.getAll({ limit: 1, sort: '-createdAt' }),
        bookingsAPI.getAll({ limit: 1, sort: '-createdAt' }),
      ])

      const inqTotal = inqRes.data?.total ?? inqRes.data?.length ?? 0
      const bookTotal = bookRes.data?.total ?? bookRes.data?.length ?? 0

      if (prevInquiryCount.current !== null && inqTotal > prevInquiryCount.current) {
        const newInq = inqRes.data?.inquiries?.[0] || inqRes.data?.[0]
        addNotification({
          id: Date.now() + '_inq',
          type: 'inquiry',
          title: 'New Inquiry!',
          message: `${newInq?.name || 'A customer'} submitted an inquiry`,
          time: new Date(),
          data: newInq,
        })
        toast.custom((t) => (
          <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} bg-surface-raised border border-brand-gold/40 rounded-2xl p-4 shadow-gold-lg flex items-start gap-3 max-w-sm`}>
            <div className="w-9 h-9 rounded-xl bg-brand-gold/20 flex items-center justify-center text-brand-gold flex-shrink-0">📩</div>
            <div>
              <p className="text-sm font-semibold text-white">New Inquiry!</p>
              <p className="text-xs text-gray-400 mt-0.5">{newInq?.name || 'A customer'} submitted a query</p>
            </div>
          </div>
        ), { duration: 5000 })
      }

      if (prevBookingCount.current !== null && bookTotal > prevBookingCount.current) {
        const newBook = bookRes.data?.bookings?.[0] || bookRes.data?.[0]
        addNotification({
          id: Date.now() + '_book',
          type: 'booking',
          title: 'New Booking!',
          message: `${newBook?.customerName || 'A customer'} made a booking`,
          time: new Date(),
          data: newBook,
        })
        toast.custom((t) => (
          <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} bg-surface-raised border border-green-500/40 rounded-2xl p-4 shadow-card-lg flex items-start gap-3 max-w-sm`}>
            <div className="w-9 h-9 rounded-xl bg-green-500/20 flex items-center justify-center text-green-400 flex-shrink-0">🚗</div>
            <div>
              <p className="text-sm font-semibold text-white">New Booking!</p>
              <p className="text-xs text-gray-400 mt-0.5">{newBook?.customerName || 'Customer'} booked a car</p>
            </div>
          </div>
        ), { duration: 5000 })
      }

      prevInquiryCount.current = inqTotal
      prevBookingCount.current = bookTotal
    } catch {}
  }

  const addNotification = (notif) => {
    setNotifications(prev => [notif, ...prev].slice(0, 50))
    setUnreadCount(c => c + 1)
  }

  const markAllRead = () => setUnreadCount(0)
  const clearAll = () => { setNotifications([]); setUnreadCount(0) }

  useEffect(() => {
    checkForNew()
    const interval = setInterval(checkForNew, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAllRead, clearAll, addNotification }}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotifications = () => useContext(NotificationContext)
