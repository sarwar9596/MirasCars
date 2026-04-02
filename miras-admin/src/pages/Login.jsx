import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Lock, Mail, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(form.email, form.password)
      toast.success('Welcome back!')
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex" style={{ background: '#F5F7F6' }}>
      {/* Left panel — branding */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden items-center justify-center" style={{ background: 'linear-gradient(135deg, #1F7A4D 0%, #2E8B57 50%, #17633E 100%)' }}>
        {/* Decorative circles */}
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 30%, #fff 0%, transparent 40%), radial-gradient(circle at 80% 70%, #fff 0%, transparent 30%)' }} />
        {/* Grid lines */}
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

        <div className="relative z-10 text-center px-12">
          <div className="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-6 shadow-xl">
            <span className="text-white font-bold text-3xl">M</span>
          </div>
          <h1 className="text-5xl font-bold text-white mb-3">Miras</h1>
          <p className="text-xl text-white/80 font-medium mb-6">Car Rental</p>
          <p className="text-white/60 text-base max-w-sm leading-relaxed">
            Premium car rental services across the Kashmir Valley — manage your fleet, bookings and business from one place.
          </p>

          <div className="mt-10 grid grid-cols-3 gap-4">
            {[['🚗','Fleet','Manage cars'],['📊','Analytics','Track revenue'],['🔔','Alerts','Live updates']].map(([icon, label, sub]) => (
              <div key={label} className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-4 text-center">
                <div className="text-2xl mb-1">{icon}</div>
                <p className="text-white text-sm font-semibold">{label}</p>
                <p className="text-white/50 text-xs mt-0.5">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #1F7A4D, #2E8B57)' }}>
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <div>
              <p className="font-bold text-gray-800">Miras Admin</p>
              <p className="text-xs text-gray-400">Car Rental Panel</p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Sign in</h2>
            <p className="text-gray-400">Access your admin dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-500 text-sm">
                <AlertCircle size={15} />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="label">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  placeholder="admin@mirasrentals.com"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  required
                  className="input pl-10"
                />
              </div>
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPw ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  required
                  className="input pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Signing in…</span>
                </>
              ) : 'Sign In to Admin Panel'}
            </button>
          </form>

          {/* Demo credentials hint */}
          <div className="mt-6 p-4 bg-white border border-gray-200 rounded-xl text-xs text-gray-500">
            <p className="font-medium text-gray-500 mb-1">Demo credentials</p>
            <p>Email: <span className="text-primary font-medium">admin@mirasrentals.com</span></p>
            <p>Password: <span className="text-primary font-medium">admin123</span></p>
          </div>
        </div>
      </div>
    </div>
  )
}
