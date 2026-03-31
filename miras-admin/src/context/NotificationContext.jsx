import { createContext, useContext, useState, useEffect, useRef } from 'react'
import { inquiriesAPI } from '../utils/api'
import toast from 'react-hot-toast'

const NotificationContext = createContext(null)

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const prevInquiryCount = useRef(null)

  const checkForNew = async () => {
    try {
      const inqRes = await inquiriesAPI.getAll({ limit: 1 })

      const inqTotal = inqRes.data?.count ?? inqRes.data?.length ?? 0

      if (prevInquiryCount.current !== null && inqTotal > prevInquiryCount.current) {
        const newInq = inqRes.data?.data?.[0]
        addNotification({
          id: Date.now() + '_inq',
          type: 'inquiry',
          title: 'New Inquiry!',
          message: `${newInq?.name || 'A customer'} submitted an inquiry`,
          time: new Date(),
          data: newInq,
        })
        toast.success(`New inquiry from ${newInq?.name || 'a customer'}!`)
      }

      prevInquiryCount.current = inqTotal
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
