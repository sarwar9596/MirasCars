import { Outlet, Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
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
    <div className='flex flex-col min-h-screen' style={{ background: 'linear-gradient(135deg, #2FA4A9 0%, #6BC1B7 45%, #F5E6CA 100%)', backgroundAttachment: 'fixed' }}>
      {/* Glassmorphic Floating Navbar */}
      <div className='navbar-glass-container'>
        <div className={`navbar ${scrolled ? 'shadow-xl' : ''} transition-all duration-300`}>
          <div className='flex items-center justify-between'>
            {/* Logo */}
            <Link to='/' className='flex items-center gap-2 flex-shrink-0'>
              <div
                className='text-xl font-display font-extrabold tracking-wide'
                style={{
                  background: 'linear-gradient(135deg, #FF8A3D, #F2994A)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                MIRAS
              </div>
              <span className='hidden sm:block text-xs font-medium text-white/60 tracking-wider'>
                CAR RENTAL
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className='hidden md:flex items-center gap-1'>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`nav-link ${isActive(link.href) ? 'active' : ''}`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* CTA Button */}
            <Link
              to='/contact'
              className='hidden md:flex btn-cta text-sm py-2.5 px-5'
            >
              Book Now
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className='md:hidden text-white p-1 hover:bg-white/10 rounded-lg transition-colors'
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

          {/* Mobile Nav Dropdown */}
          {menuOpen && (
            <div className='md:hidden mt-3 pt-3 border-t border-white/20 space-y-1'>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`block px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive(link.href)
                      ? 'bg-white/20 text-white'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to='/contact'
                className='block mt-2 btn-cta text-sm py-2.5 px-5 text-center'
              >
                Book Now
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <main className='flex-1 pt-[72px]'>
        <Outlet />
      </main>

      {/* Footer */}
      <footer style={{ background: 'rgba(26,26,26,0.85)', backdropFilter: 'blur(20px)' }} className='text-white'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
          <div className='grid grid-cols-1 md:grid-cols-4 gap-10 mb-10'>
            {/* Brand */}
            <div>
              <div
                className='text-xl font-display font-extrabold mb-3'
                style={{
                  background: 'linear-gradient(135deg, #FF8A3D, #F2994A)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                MIRAS
              </div>
              <p className='text-white/60 text-sm mb-4 leading-relaxed'>
                Experience Kashmir like never before. Premium car rental with expert local guides and 24/7 support.
              </p>
              <a
                href='https://wa.me/919103489268'
                target='_blank'
                rel='noopener noreferrer'
                className='text-sm font-medium hover:text-orange-400 transition-colors'
                style={{ color: '#F2994A' }}
              >
                WhatsApp: +91 9103489268
              </a>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className='font-semibold text-white/90 mb-4 text-sm uppercase tracking-wider'>Quick Links</h3>
              <ul className='space-y-2.5'>
                {[
                  ['Our Fleet', '/cars'],
                  ['Travel Guides', '/blogs'],
                  ['About Us', '/about'],
                  ['Contact', '/contact'],
                ].map(([label, href]) => (
                  <li key={href}>
                    <Link
                      to={href}
                      className='text-white/55 hover:text-white text-sm transition-colors'
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Fleet */}
            <div>
              <h3 className='font-semibold text-white/90 mb-4 text-sm uppercase tracking-wider'>Our Fleet</h3>
              <ul className='space-y-2.5'>
                {['SUV', 'Sedan', 'Hatchback', 'Luxury', 'MUV'].map((cat) => (
                  <li key={cat}>
                    <Link
                      to={`/cars?category=${cat}`}
                      className='text-white/55 hover:text-white text-sm transition-colors capitalize'
                    >
                      {cat}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Why Miras */}
            <div>
              <h3 className='font-semibold text-white/90 mb-4 text-sm uppercase tracking-wider'>Why Miras?</h3>
              <ul className='space-y-2.5 text-sm text-white/55'>
                {[
                  '✓ 24/7 Roadside Assistance',
                  '✓ Transparent Pricing',
                  '✓ Wide Range of Vehicles',
                  '✓ Expert Local Drivers',
                  '✓ All-Inclusive Insurance',
                ].map((item) => (
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
