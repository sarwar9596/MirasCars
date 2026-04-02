import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

const pageMeta = {
  '/': { title: 'Dashboard', subtitle: 'Overview of Miras Car Rental' },
  '/cars': { title: 'Fleet Management', subtitle: 'Add, edit & manage your vehicles' },
  '/cars/add': { title: 'Add New Car', subtitle: 'List a new vehicle on the website' },
  '/bookings': { title: 'Bookings & Orders', subtitle: 'Manage customer reservations' },
  '/inquiries': { title: 'Customer Inquiries', subtitle: 'Messages from your website visitors' },
  '/blogs': { title: 'Blog Management', subtitle: 'Create and publish articles' },
  '/blogs/add': { title: 'Write New Post', subtitle: 'Create a new blog article' },
  '/analytics': { title: 'Analytics', subtitle: 'Performance insights & trends' },
  '/settings': { title: 'Settings', subtitle: 'Configure your website & preferences' },
}

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()

  const meta = pageMeta[location.pathname] || { title: 'Miras Admin' }

  return (
    <div className="min-h-screen flex" style={{ background: '#F5F7F6' }}>
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} />

      <div className={`flex-1 flex flex-col transition-all duration-300 ${collapsed ? 'ml-[72px]' : 'ml-64'}`}>
        <Topbar title={meta.title} subtitle={meta.subtitle} />
        <main className="flex-1 p-6 overflow-auto page-enter">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
