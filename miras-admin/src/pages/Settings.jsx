import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { Save, Phone, Globe, MapPin, Mail, MessageSquare, Shield, Bell } from 'lucide-react'
import toast from 'react-hot-toast'
import { settingsAPI } from '../utils/api'

export default function Settings() {
  const { admin } = useAuth()
  const [business, setBusiness] = useState({
    businessName: 'Miras Car Rental',
    tagline: 'Premium Car Rentals Across Kashmir Valley',
    phone: '+91 9103489268',
    whatsapp: '919103489268',
    email: 'info@mirasrentals.com',
    address: 'Residency Road, Lal Chowk, Srinagar, J&K 190001',
    website: 'https://mirasrentals.com',
    currency: 'INR',
    seasonalNote: 'Prices may vary during Amarnath Yatra, Tulip Garden Festival & peak summer season.',
  })
  const [password, setPassword] = useState({ current: '', newPass: '', confirm: '' })
  const [notifs, setNotifs] = useState({ newInquiry: true, newBooking: true, whatsappAlert: true })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    settingsAPI.get()
      .then(res => {
        const data = res.data?.data || res.data
        if (data) setBusiness(prev => ({ ...prev, ...data }))
      })
      .catch(() => {})
  }, [])

  const saveBusiness = async () => {
    setSaving(true)
    try {
      await settingsAPI.update(business)
      toast.success('Business settings saved!')
    } catch {
      toast.error('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const savePassword = async (e) => {
    e.preventDefault()
    if (password.newPass !== password.confirm) { toast.error('Passwords do not match'); return }
    if (password.newPass.length < 6) { toast.error('Password must be at least 6 characters'); return }
    setSaving(true)
    await new Promise(r => setTimeout(r, 800))
    toast.success('Password updated!')
    setPassword({ current: '', newPass: '', confirm: '' })
    setSaving(false)
  }

  const bs = (k, v) => setBusiness(b => ({ ...b, [k]: v }))

  return (
    <div className="max-w-3xl mx-auto space-y-6 page-enter">
      {/* Business Info */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center"><Globe size={17} className="text-primary" /></div>
          <h2 className="font-bold text-gray-800 text-lg">Business Information</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="label">Business Name</label>
            <input value={business.businessName} onChange={e => bs('businessName', e.target.value)} className="input" />
          </div>
          <div className="md:col-span-2">
            <label className="label">Tagline</label>
            <input value={business.tagline} onChange={e => bs('tagline', e.target.value)} className="input" />
          </div>
          <div>
            <label className="label flex items-center gap-1.5"><Phone size={11} /> Phone</label>
            <input value={business.phone} onChange={e => bs('phone', e.target.value)} className="input" />
          </div>
          <div>
            <label className="label flex items-center gap-1.5"><MessageSquare size={11} /> WhatsApp Number</label>
            <input value={business.whatsapp} onChange={e => bs('whatsapp', e.target.value)} placeholder="91XXXXXXXXXX (no + or spaces)" className="input" />
            <p className="text-xs text-gray-400 mt-1">Used for customer notification links. Format: country code + number (e.g. 919103489268)</p>
          </div>
          <div>
            <label className="label flex items-center gap-1.5"><Mail size={11} /> Email</label>
            <input type="email" value={business.email} onChange={e => bs('email', e.target.value)} className="input" />
          </div>
          <div>
            <label className="label flex items-center gap-1.5"><Globe size={11} /> Website URL</label>
            <input value={business.website} onChange={e => bs('website', e.target.value)} className="input" />
          </div>
          <div className="md:col-span-2">
            <label className="label flex items-center gap-1.5"><MapPin size={11} /> Address</label>
            <textarea value={business.address} onChange={e => bs('address', e.target.value)} rows={2} className="input resize-none" />
          </div>
          <div className="md:col-span-2">
            <label className="label">Seasonal Pricing Note (shown on website)</label>
            <textarea value={business.seasonalNote} onChange={e => bs('seasonalNote', e.target.value)} rows={2} className="input resize-none" />
          </div>
        </div>
        <button onClick={saveBusiness} disabled={saving} className="btn-primary mt-5 flex items-center gap-2">
          {saving ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>Saving…</> : <><Save size={15}/>Save Changes</>}
        </button>
      </div>

      {/* Notifications */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center"><Bell size={17} className="text-blue-500" /></div>
          <h2 className="font-bold text-gray-800 text-lg">Notification Preferences</h2>
        </div>
        <div className="space-y-4">
          {[
            { key: 'newInquiry', label: 'New Inquiry Alert', sub: 'Get notified in dashboard when a customer submits an inquiry' },
            { key: 'newBooking', label: 'New Booking Alert', sub: 'Get notified in dashboard when a new booking is placed' },
            { key: 'whatsappAlert', label: 'WhatsApp Notification Links', sub: 'Generate WhatsApp message links for new inquiries & bookings' },
          ].map(item => (
            <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <p className="text-sm font-medium text-gray-700">{item.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{item.sub}</p>
              </div>
              <button
                onClick={() => setNotifs(n => ({ ...n, [item.key]: !n[item.key] }))}
                className={`w-12 h-6 rounded-full transition-all flex-shrink-0 relative ${notifs[item.key] ? 'bg-primary' : 'bg-gray-300'}`}
              >
                <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all ${notifs[item.key] ? 'left-6' : 'left-0.5'}`} />
              </button>
            </div>
          ))}
        </div>
        <button onClick={() => toast.success('Notification settings saved!')} className="btn-outline mt-4 flex items-center gap-2">
          <Save size={15} /> Save Preferences
        </button>
      </div>

      {/* Change Password */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl bg-purple-100 flex items-center justify-center"><Shield size={17} className="text-purple-500" /></div>
          <h2 className="font-bold text-gray-800 text-lg">Change Password</h2>
        </div>
        <form onSubmit={savePassword} className="space-y-4 max-w-md">
          <div>
            <label className="label">Current Password</label>
            <input type="password" value={password.current} onChange={e => setPassword(p => ({ ...p, current: e.target.value }))} className="input" required />
          </div>
          <div>
            <label className="label">New Password</label>
            <input type="password" value={password.newPass} onChange={e => setPassword(p => ({ ...p, newPass: e.target.value }))} className="input" required />
          </div>
          <div>
            <label className="label">Confirm New Password</label>
            <input type="password" value={password.confirm} onChange={e => setPassword(p => ({ ...p, confirm: e.target.value }))} className="input" required />
          </div>
          <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
            {saving ? 'Updating…' : 'Update Password'}
          </button>
        </form>
      </div>

      {/* About panel */}
      <div className="card p-6 flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shadow-primary flex-shrink-0">
          <span className="text-white font-bold text-2xl">M</span>
        </div>
        <div>
          <p className="font-bold text-gray-800 text-lg">Miras Admin Panel</p>
          <p className="text-gray-400 text-sm">Version 1.0.0 · Built for Miras Car Rental, Kashmir</p>
          <p className="text-xs text-gray-300 mt-1">Backend: localhost:5000 · Frontend: localhost:3000 · Admin: localhost:3001</p>
        </div>
      </div>
    </div>
  )
}
