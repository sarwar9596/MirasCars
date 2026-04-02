import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { carsAPI, blogsAPI } from '../utils/api';
import { ArrowRight, MapPin, Users, Zap, Phone } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Home() {
	const [featuredCars, setFeaturedCars] = useState([]);
	const [recentBlogs, setRecentBlogs] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [carsRes, blogsRes] = await Promise.all([
					carsAPI.getAll({ limit: 6 }),
					blogsAPI.getAll({ limit: 3 }),
				]);
				setFeaturedCars(carsRes.data?.data || []);
				setRecentBlogs(blogsRes.data?.data || []);
			} catch {
				toast.error('Failed to load content');
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, []);

	const features = [
		{ icon: '🚗', bg: 'rgba(0,51,102,0.08)', title: 'Premium Fleet', desc: 'Regularly serviced & inspected before every trip' },
		{ icon: '💰', bg: 'rgba(197,160,89,0.12)', title: 'Transparent Pricing', desc: 'No hidden fees — the price you see is what you pay' },
		{ icon: '🛡️', bg: 'rgba(0,51,102,0.08)', title: 'Fully Insured', desc: 'Comprehensive insurance with every rental' },
		{ icon: '👨‍✈️', bg: 'rgba(197,160,89,0.12)', title: 'Expert Drivers', desc: 'Licensed locals who know every road in the valley' },
		{ icon: '📍', bg: 'rgba(0,51,102,0.08)', title: 'Flexible Pickup', desc: 'Airport, hotel, or railway — we come to you' },
		{ icon: '⏰', bg: 'rgba(197,160,89,0.12)', title: '24/7 Support', desc: 'Round-the-clock roadside assistance in the valley' },
	];

	return (
		<div>
			{/* ═══════════════════════════════════════════ */}
			{/* HERO SECTION — Wavy Bottom                */}
			{/* ═══════════════════════════════════════════ */}
			<section className='relative overflow-hidden' style={{ background: 'linear-gradient(135deg, #003366 0%, #004080 100%)' }}>
				{/* Background image + dark overlay */}
				<div className='absolute inset-0'>
					<img src='/hero.jpeg' alt='Kashmir landscape' className='w-full h-full object-cover' />
					<div className='absolute inset-0' style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.6))' }} />
				</div>

				{/* Hero Content + Trust Bar in a flex column */}
				<div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full'>
					<div className='flex flex-col justify-between' style={{ minHeight: '92vh' }}>
						{/* Top hero content */}
						<div className='pt-20 pb-8'>
							<div className='max-w-2xl'>
								<span className='section-label mb-5 block'>Your Trusted Kashmir Travel Partner</span>
								<h1 className='font-display font-bold mb-6 leading-tight' style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: '#FFFFFF' }}>
									Explore Kashmir<br />
									<span style={{ background: 'linear-gradient(135deg, #C5A059, #D4B06A)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Like Never Before</span>
								</h1>
								<p className='text-lg mb-8 leading-relaxed' style={{ color: '#E5E5E5' }}>
									Premium self-drive and chauffeur-driven cars for every terrain. From the lakes of Srinagar to the peaks of Gulmarg — travel at your own pace.
								</p>
								<div className='flex flex-col sm:flex-row gap-3'>
									<Link to='/cars' className='btn-blue text-base px-7 py-3.5 justify-center'>View Our Fleet <ArrowRight size={18} /></Link>
									<Link to='/contact' className='btn-ghost-white text-base px-7 py-3.5 justify-center'><Phone size={17} /> Contact Us</Link>
								</div>
							</div>
						</div>

						{/* ── Trust Bar at bottom of hero ── */}
						<div className='pb-16'>
							<div className='flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm font-semibold' style={{ color: 'white' }}>
								{[
									{ icon: '🔒', text: 'No Hidden Charges' },
									{ icon: '↩️', text: 'Free Cancellation' },
									{ icon: '🔧', text: 'Well-Maintained Fleet' },
									{ icon: '🪪', text: 'Licensed Drivers' },
									{ icon: '🌍', text: 'All India Permits' },
								].map((item) => (
									<span key={item.text} className='flex items-center gap-2 px-4 py-2 rounded-full'
										style={{ background: 'rgba(0,51,102,0.7)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(197,160,89,0.25)', letterSpacing: '0.3px' }}>
										<span>{item.icon}</span>
										{item.text}
									</span>
								))}
							</div>
						</div>
					</div>
				</div>

				{/* ── Wavy Bottom Border ── */}
				<div className='absolute bottom-0 left-0 w-full'>
					<svg viewBox='0 0 1440 120' fill='none' xmlns='http://www.w3.org/2000/svg' className='w-full' preserveAspectRatio='none' style={{ height: '100px' }}>
						<path d='M0,70 C180,20 360,120 540,70 C720,20 900,120 1080,70 C1260,20 1350,90 1440,70 L1440,120 L0,120 Z' fill='white' />
					</svg>
				</div>
			</section>

			{/* ═══════════════════════════════════════════ */}
			{/* FEATURED CARS */}
			{/* ═══════════════════════════════════════════ */}
			<section className='py-20' style={{ background: '#F8F9FA' }}>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='flex items-end justify-between mb-12'>
						<div>
							<span className='section-label-gold mb-3 block'>Our Fleet</span>
							<h2 className='font-display font-bold' style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', color: '#1A1A1A' }}>Featured Vehicles</h2>
						</div>
						<Link to='/cars' className='hidden md:inline-flex items-center gap-2 font-semibold transition-colors' style={{ color: '#C5A059' }}>View All <ArrowRight size={16} /></Link>
					</div>
					{loading ? (
						<div className='flex justify-center py-16'>
							<div className='w-12 h-12 border-4 rounded-full animate-spin' style={{ borderColor: 'rgba(0,51,102,0.15)', borderTopColor: '#003366' }} />
						</div>
					) : featuredCars.length > 0 ? (
						<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
							{featuredCars.slice(0, 6).map((car) => (
								<Link key={car._id} to={`/cars/${car.slug}`} className='car-card group'>
									{car.images?.[0] && (
										<div className='h-52 overflow-hidden relative'>
											<img src={car.images[0]} alt={car.name} className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500' />
											<div className='absolute top-3 left-3'><span className='tag'>{car.category}</span></div>
											{car.isFeatured && <div className='absolute top-3 right-3'><span className='tag-gold'>FEATURED</span></div>}
										</div>
									)}
									<div className='p-5'>
										<h3 className='text-base font-bold mb-2' style={{ color: '#1A1A1A' }}>{car.name}</h3>
										<div className='flex items-center gap-4 text-sm mb-4' style={{ color: '#6B7280' }}>
											<span className='flex items-center gap-1'><Users size={13} /> {car.seats} Seats</span>
											<span className='flex items-center gap-1'><Zap size={13} /> {car.transmission}</span>
										</div>
										<div className='flex items-baseline justify-between pt-3' style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
											<div>
												<span className='text-2xl font-extrabold' style={{ background: 'linear-gradient(135deg, #C5A059, #D4B06A)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>₹{car.pricePerDay?.toLocaleString()}</span>
												<span className='text-sm ml-1' style={{ color: '#6B7280' }}>/day</span>
											</div>
											<span className='text-sm font-semibold' style={{ color: '#C5A059' }}>View →</span>
										</div>
									</div>
								</Link>
							))}
						</div>
					) : (
						<div className='text-center py-16' style={{ color: '#6B7280' }}>No vehicles available yet</div>
					)}
					<div className='text-center mt-8 md:hidden'>
						<Link to='/cars' className='btn-blue px-7 py-3'>View All Vehicles</Link>
					</div>
				</div>
			</section>

			{/* Wavy Divider */}
			<div style={{ background: '#F8F9FA' }}>
				<svg viewBox='0 0 1440 80' fill='none' xmlns='http://www.w3.org/2000/svg' className='w-full' preserveAspectRatio='none' style={{ height: '60px' }}>
					<path d='M0,20 C360,70 720,10 1080,50 C1260,70 1380,40 1440,30 L1440,80 L0,80 Z' fill='white' />
				</svg>
			</div>

			{/* ═══════════════════════════════════════════ */}
			{/* WHY CHOOSE US */}
			{/* ═══════════════════════════════════════════ */}
			<section className='py-20' style={{ background: 'white' }}>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='text-center mb-14'>
						<span className='section-label mb-3 block'>Why Miras</span>
						<h2 className='font-display font-bold' style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', color: '#1A1A1A' }}>Why Travelers Choose Us</h2>
					</div>
					<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
						{features.map((item) => (
							<div key={item.title} className='feature-card'>
								<div className='feature-icon' style={{ background: item.bg }}>{item.icon}</div>
								<h3 className='text-base font-bold mb-2' style={{ color: '#1A1A1A' }}>{item.title}</h3>
								<p className='text-sm leading-relaxed' style={{ color: '#6B7280' }}>{item.desc}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Wavy Divider */}
			<div style={{ background: 'white' }}>
				<svg viewBox='0 0 1440 80' fill='none' xmlns='http://www.w3.org/2000/svg' className='w-full' preserveAspectRatio='none' style={{ height: '60px' }}>
					<path d='M0,30 C320,80 640,10 960,40 C1200,60 1380,20 1440,25 L1440,80 L0,80 Z' fill='#F8F9FA' />
				</svg>
			</div>

			{/* ═══════════════════════════════════════════ */}
			{/* POPULAR DESTINATIONS */}
			{/* ═══════════════════════════════════════════ */}
			<section className='py-20' style={{ background: '#F8F9FA' }}>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='text-center mb-14'>
						<span className='section-label-blue mb-3 block'>Travel Guides</span>
						<h2 className='font-display font-bold' style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', color: '#1A1A1A' }}>Explore Kashmir Destinations</h2>
					</div>
					<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5'>
						{[
							{ name: 'Srinagar', desc: 'Dal Lake, Mughal Gardens & Shikara rides', img: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&q=80' },
							{ name: 'Gulmarg', desc: "Snow-capped peaks & the world's highest gondola", img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80' },
							{ name: 'Pahalgam', desc: 'Betaab Valley, Aru Valley & Chandanwari', img: 'https://images.unsplash.com/photo-1567604528556-f0f3e5f0b87e?w=600&q=80' },
							{ name: 'Sonmarg', desc: 'Golden meadow, Thajiwas Glacier & riverside camps', img: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&q=80' },
						].map((place) => (
							<div key={place.name} className='destination-card group cursor-pointer'>
								<div className='h-44 overflow-hidden'>
									<img src={place.img} alt={place.name} className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500' />
								</div>
								<div className='p-4'>
									<div className='flex items-center gap-1.5 mb-1'>
										<MapPin size={14} style={{ color: '#003366' }} />
										<h3 className='font-bold' style={{ color: '#1A1A1A' }}>{place.name}</h3>
									</div>
									<p className='text-xs' style={{ color: '#6B7280' }}>{place.desc}</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* ═══════════════════════════════════════════ */}
			{/* BLOG PREVIEW */}
			{/* ═══════════════════════════════════════════ */}
			{recentBlogs.length > 0 && (
				<>
					<div style={{ background: '#F8F9FA' }}>
						<svg viewBox='0 0 1440 80' fill='none' xmlns='http://www.w3.org/2000/svg' className='w-full' preserveAspectRatio='none' style={{ height: '60px' }}>
							<path d='M0,25 C480,75 960,5 1440,45 L1440,80 L0,80 Z' fill='white' />
						</svg>
					</div>
					<section className='py-20' style={{ background: 'white' }}>
						<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
							<div className='flex items-end justify-between mb-12'>
								<div>
									<span className='section-label mb-3 block'>From Our Blog</span>
									<h2 className='font-display font-bold' style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', color: '#1A1A1A' }}>Travel Stories & Guides</h2>
								</div>
								<Link to='/blogs' className='hidden md:inline-flex items-center gap-2 font-semibold transition-colors' style={{ color: '#C5A059' }}>Read All <ArrowRight size={16} /></Link>
							</div>
							<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
								{recentBlogs.map((blog) => (
									<Link key={blog._id} to={`/blog/${blog.slug}`} className='blog-card group'>
										{blog.featuredImage && (
											<div className='h-48 overflow-hidden'>
												<img src={blog.featuredImage} alt={blog.title} className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500' />
											</div>
										)}
										<div className='p-5'>
											<span className='tag mb-3'>{blog.category || 'Travel'}</span>
											<h3 className='text-base font-bold mb-2 line-clamp-2' style={{ color: '#1A1A1A' }}>{blog.title}</h3>
											<p className='text-sm line-clamp-2 mb-3' style={{ color: '#6B7280' }}>{blog.excerpt}</p>
											<div className='flex items-center justify-between text-xs' style={{ color: '#6B7280' }}>
												<span>{blog.readTime || '5 min read'}</span>
												<span className='font-semibold' style={{ color: '#C5A059' }}>Read →</span>
											</div>
										</div>
									</Link>
								))}
							</div>
						</div>
					</section>
				</>
			)}

			{/* ═══════════════════════════════════════════ */}
			{/* CTA SECTION */}
			{/* ═══════════════════════════════════════════ */}
			<section className='cta-section py-24 relative'>
				<div className='relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
					<h2 className='font-display font-extrabold text-white mb-5' style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}>Ready for Your Kashmir Adventure?</h2>
					<p className='text-lg mb-10' style={{ color: 'rgba(255,255,255,0.85)' }}>
						Book your car today and explore paradise at your own pace.<br />Contact us on WhatsApp for the fastest response.
					</p>
					<div className='flex flex-col sm:flex-row gap-4 justify-center'>
						<Link to='/contact' className='inline-flex items-center justify-center gap-2 font-semibold rounded-full px-8 py-3.5 transition-all'
							style={{ background: 'linear-gradient(135deg, #C5A059, #D4B06A)', color: 'white', boxShadow: '0 4px 20px rgba(197,160,89,0.4)' }}>
							Book Your Ride
						</Link>
						<a href='https://wa.me/919103489268?text=Hi%20Miras!%20I%27d%20like%20to%20rent%20a%20car%20in%20Kashmir.' target='_blank' rel='noopener noreferrer'
							className='inline-flex items-center justify-center gap-2 font-semibold rounded-full px-8 py-3.5 transition-all'
							style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.4)', color: 'white' }}>
							💬 Chat on WhatsApp
						</a>
					</div>
				</div>
			</section>
		</div>
	);
}
