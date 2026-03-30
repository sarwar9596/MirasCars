import { Outlet, Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Layout() {
	const [menuOpen, setMenuOpen] = useState(false);

	const navLinks = [
		{ label: 'Home', href: '/' },
		{ label: 'Cars', href: '/cars' },
		{ label: 'Blogs', href: '/blogs' },
		{ label: 'About', href: '/about' },
		{ label: 'Contact', href: '/contact' },
	];

	return (
		<div className='flex flex-col min-h-screen bg-dark-900'>
			{/* Header */}
			<header className='sticky top-0 z-50 bg-dark-800/95 backdrop-blur border-b border-dark-400/30'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4'>
					<div className='flex items-center justify-between'>
						<Link to='/' className='flex items-center gap-2'>
							<div className='text-2xl font-display font-bold gold-text'>
								MIRAS
							</div>
							<span className='hidden sm:block text-gray-400 text-xs'>
								CAR RENTAL
							</span>
						</Link>

						{/* Desktop Nav */}
						<nav className='hidden md:flex items-center gap-8'>
							{navLinks.map((link) => (
								<Link
									key={link.href}
									to={link.href}
									className='text-gray-300 hover:text-brand-gold transition-colors text-sm font-medium'>
									{link.label}
								</Link>
							))}
							<Link to='/contact' className='btn-gold text-sm'>
								Book Now
							</Link>
						</nav>

						{/* Mobile Menu Button */}
						<button
							onClick={() => setMenuOpen(!menuOpen)}
							className='md:hidden text-gray-400 hover:text-brand-gold'>
							{menuOpen ? <X size={24} /> : <Menu size={24} />}
						</button>
					</div>

					{/* Mobile Nav */}
					{menuOpen && (
						<nav className='md:hidden mt-4 space-y-3 py-4 border-t border-dark-400/30'>
							{navLinks.map((link) => (
								<Link
									key={link.href}
									to={link.href}
									onClick={() => setMenuOpen(false)}
									className='block text-gray-300 hover:text-brand-gold transition-colors text-sm font-medium py-2'>
									{link.label}
								</Link>
							))}
							<Link
								to='/contact'
								className='block btn-gold text-center text-sm mt-4'>
								Book Now
							</Link>
						</nav>
					)}
				</div>
			</header>

			{/* Main Content */}
			<main className='flex-1'>
				<Outlet />
			</main>

			{/* Footer */}
			<footer className='bg-dark-800 border-t border-dark-400/30 mt-16'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
					<div className='grid grid-cols-1 md:grid-cols-4 gap-8 mb-8'>
						{/* Brand */}
						<div>
							<div className='text-xl font-display font-bold gold-text mb-3'>
								MIRAS
							</div>
							<p className='text-gray-400 text-sm mb-4'>
								Experience Kashmir like never before. Premium car
								rental with expert local guides.
							</p>
							<a
								href='https://wa.me/919876543210'
								target='_blank'
								rel='noopener noreferrer'
								className='text-brand-gold text-sm font-medium hover:text-brand-gold-light'>
								WhatsApp: +91 98765 43210
							</a>
						</div>

						{/* Quick Links */}
						<div>
							<h3 className='font-semibold text-white mb-4'>
								Quick Links
							</h3>
							<ul className='space-y-2'>
								<li>
									<Link
										to='/cars'
										className='text-gray-400 hover:text-brand-gold text-sm transition-colors'>
										Our Fleet
									</Link>
								</li>
								<li>
									<Link
										to='/blogs'
										className='text-gray-400 hover:text-brand-gold text-sm transition-colors'>
										Travel Guides
									</Link>
								</li>
								<li>
									<Link
										to='/about'
										className='text-gray-400 hover:text-brand-gold text-sm transition-colors'>
										About Us
									</Link>
								</li>
								<li>
									<Link
										to='/contact'
										className='text-gray-400 hover:text-brand-gold text-sm transition-colors'>
										Contact
									</Link>
								</li>
							</ul>
						</div>

						{/* Fleet */}
						<div>
							<h3 className='font-semibold text-white mb-4'>Fleet</h3>
							<ul className='space-y-2'>
								<li>
									<a
										href='/cars?category=SUV'
										className='text-gray-400 hover:text-brand-gold text-sm transition-colors'>
										SUVs
									</a>
								</li>
								<li>
									<a
										href='/cars?category=Sedan'
										className='text-gray-400 hover:text-brand-gold text-sm transition-colors'>
										Sedans
									</a>
								</li>
								<li>
									<a
										href='/cars?category=Hatchback'
										className='text-gray-400 hover:text-brand-gold text-sm transition-colors'>
										Hatchbacks
									</a>
								</li>
								<li>
									<a
										href='/cars?category=Luxury'
										className='text-gray-400 hover:text-brand-gold text-sm transition-colors'>
										Luxury
									</a>
								</li>
							</ul>
						</div>

						{/* Info */}
						<div>
							<h3 className='font-semibold text-white mb-4'>
								Information
							</h3>
							<ul className='space-y-2 text-gray-400 text-sm'>
								<li>✓ 24/7 Support</li>
								<li>✓ Best Price Guarantee</li>
								<li>✓ Wide Range of Vehicles</li>
								<li>✓ Expert Local Guides</li>
							</ul>
						</div>
					</div>

					<div className='border-t border-dark-400/30 pt-8 text-center text-gray-500 text-sm'>
						<p>&copy; 2024 Miras Car Rental. All rights reserved.</p>
					</div>
				</div>
			</footer>
		</div>
	);
}
