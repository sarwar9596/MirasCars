import { Outlet, Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useSettings } from '../context/SettingsContext';

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { whatsapp } = useSettings();

  useEffect(() => { setMenuOpen(false); }, [location]);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Fleet', href: '/cars' },
    { label: 'Blog', href: '/blogs' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  const isActive = (href) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  return (
    <div className='flex flex-col min-h-screen'>
      {/* ── Deep Blue Navbar ─────────────────────── */}
      <header
        style={{
          background: 'rgba(0, 51, 102, 0.95)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(197, 160, 89, 0.2)',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.2)',
        }}
      >
        {/* Top gold accent line */}
        <div style={{ height: '3px', background: 'linear-gradient(90deg, #C5A059, #D4B06A)' }} />

        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center justify-between h-16'>

            {/* ── Logo ──────────────────────────── */}
            <Link to='/' className='flex items-center gap-3 group'>
              <div className='w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110'
                style={{ background: 'linear-gradient(135deg, #C5A059, #D4B06A)', boxShadow: '0 4px 12px rgba(197,160,89,0.4)' }}>
                <svg width='18' height='18' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                  <path d='M5 17h14M5 17a2 2 0 01-2-2V9a2 2 0 012-2h14a2 2 0 012 2v6a2 2 0 01-2 2M5 17l-1 3M19 17l1 3M7 9l1.5-3.5A1.5 1.5 0 0110 4h4a1.5 1.5 0 011.5 1.5L17 9'
                    stroke='white' strokeWidth='1.8' strokeLinecap='round' strokeLinejoin='round'/>
                </svg>
              </div>
              <div className='flex items-baseline gap-2'>
                <span
                  className='text-xl font-display font-bold tracking-wider'
                  style={{
                    background: 'linear-gradient(135deg, #C5A059, #D4B06A)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    letterSpacing: '3px',
                  }}
                >
                  MIRAS
                </span>
                <span className='hidden sm:block text-[10px] font-medium tracking-[4px] uppercase' style={{ color: 'rgba(255,255,255,0.4)' }}>
                  Car Rental
                </span>
              </div>
            </Link>

            {/* ── Desktop Nav ─────────────────────── */}
            <nav className='hidden lg:flex items-center gap-1'>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className='relative px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200'
                  style={{
                    color: isActive(link.href) ? 'white' : '#D1D1D1',
                    background: isActive(link.href) ? 'rgba(197,160,89,0.15)' : 'transparent',
                    letterSpacing: '0.3px',
                  }}
                >
                  {link.label}
                  {isActive(link.href) && (
                    <span className='absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-full' style={{ background: 'linear-gradient(90deg, #C5A059, #D4B06A)' }} />
                  )}
                </Link>
              ))}
            </nav>

            {/* ── Right Actions ─────────────────── */}
            <div className='flex items-center gap-3'>
              {/* WhatsApp — beige/cream */}
              <a
                href={`https://wa.me/${whatsapp}`}
                target='_blank'
                rel='noopener noreferrer'
                className='hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200'
                style={{ background: '#F5F5DC', color: '#333333', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
              >
                <svg width='14' height='14' viewBox='0 0 24 24' fill='currentColor' xmlns='http://www.w3.org/2000/svg'>
                  <path d='M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z'/>
                  <path d='M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.789l4.35-1.768C7.074 23.09 9.41 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.21 0-4.28-.716-5.967-1.926l-.426.173-2.35.76.774-2.287A9.956 9.956 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z'/>
                </svg>
                WhatsApp
              </a>

              {/* Book Now — gold CTA */}
              <Link
                to='/contact'
                className='hidden sm:flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200'
                style={{
                  background: 'linear-gradient(135deg, #C5A059, #D4B06A)',
                  color: 'white',
                  boxShadow: '0 4px 15px rgba(197,160,89,0.4)',
                  letterSpacing: '0.3px',
                }}
              >
                Book Now
                <svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round'>
                  <path d='M5 12h14M12 5l7 7-7 7'/>
                </svg>
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className='lg:hidden p-2 rounded-xl transition-colors'
                style={{ color: 'rgba(255,255,255,0.7)', background: 'rgba(255,255,255,0.08)' }}
              >
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* ── Mobile Nav Dropdown ─────────────── */}
          {menuOpen && (
            <div className='lg:hidden py-4 space-y-1' style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className='flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors'
                  style={{
                    color: isActive(link.href) ? 'white' : '#D1D1D1',
                    background: isActive(link.href) ? 'rgba(197,160,89,0.12)' : 'transparent',
                  }}
                >
                  {link.label}
                </Link>
              ))}
              <div className='flex gap-3 pt-3'>
                <a href={`https://wa.me/${whatsapp}`} target='_blank' rel='noopener noreferrer'
                  className='flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium'
                  style={{ background: '#F5F5DC', color: '#333333' }}>
                  WhatsApp
                </a>
                <Link to='/contact'
                  className='flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold'
                  style={{ background: 'linear-gradient(135deg, #C5A059, #D4B06A)', color: 'white' }}>
                  Book Now
                </Link>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className='flex-1'>
        <Outlet />
      </main>

      {/* Footer */}
      <footer style={{ background: 'rgba(0, 51, 102, 0.95)', backdropFilter: 'blur(20px)' }} className='text-white'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
          <div className='grid grid-cols-1 md:grid-cols-4 gap-10 mb-10'>
            <div>
              <div className='text-xl font-display font-extrabold mb-3'
                style={{ background: 'linear-gradient(135deg, #C5A059, #D4B06A)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                MIRAS
              </div>
              <p className='text-white/60 text-sm mb-4 leading-relaxed'>
                Experience Kashmir like never before. Premium car rental with expert local guides and 24/7 support.
              </p>
              <a href={`https://wa.me/${whatsapp}`} target='_blank' rel='noopener noreferrer'
                className='text-sm font-medium transition-colors' style={{ color: '#C5A059' }}>
                WhatsApp: +91 {whatsapp}
              </a>
            </div>
            <div>
              <h3 className='font-semibold text-white/90 mb-4 text-sm uppercase tracking-wider'>Quick Links</h3>
              <ul className='space-y-2.5'>
                {[['Our Fleet','/cars'],['Travel Guides','/blogs'],['About Us','/about'],['Contact','/contact']].map(([label, href]) => (
                  <li key={href}><Link to={href} className='text-white/55 hover:text-white text-sm transition-colors'>{label}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className='font-semibold text-white/90 mb-4 text-sm uppercase tracking-wider'>Our Fleet</h3>
              <ul className='space-y-2.5'>
                {['SUV','Sedan','Hatchback','Luxury','MUV'].map((cat) => (
                  <li key={cat}><Link to={`/cars?category=${cat}`} className='text-white/55 hover:text-white text-sm transition-colors capitalize'>{cat}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className='font-semibold text-white/90 mb-4 text-sm uppercase tracking-wider'>Why Miras?</h3>
              <ul className='space-y-2.5 text-sm text-white/55'>
                {['✓ 24/7 Roadside Assistance','✓ Transparent Pricing','✓ Wide Range of Vehicles','✓ Expert Local Drivers','✓ All-Inclusive Insurance'].map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className='border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-white/40 text-sm'>
            <p>© 2024 Miras Car Rental, Srinagar. All rights reserved.</p>
            <p>Explore Kashmir with confidence</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
