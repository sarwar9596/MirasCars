import { Link } from 'react-router-dom';

export default function About() {
	return (
		<div>
			{/* ── Header ──────────────────────────────── */}
			<section
				className='py-20 relative overflow-hidden'
				style={{
					background: 'linear-gradient(135deg, #003366 0%, #004080 100%)',
				}}
			>
				<div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					<span className='section-label mb-3 block'>Our Story</span>
					<h1 className='font-display font-bold text-white' style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
						About Miras
					</h1>
				</div>
				<div className='absolute bottom-0 left-0 w-full'>
					<svg viewBox='0 0 1440 80' fill='none' xmlns='http://www.w3.org/2000/svg' className='w-full' preserveAspectRatio='none' style={{ height: '70px' }}>
						<path d='M0,40 C320,80 640,10 960,45 C1200,65 1380,30 1440,25 L1440,80 L0,80 Z' fill='white' />
					</svg>
				</div>
			</section>

			{/* ── Content ─────────────────────────────── */}
			<div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20'>
				<div className='space-y-8 text-base leading-relaxed' style={{ color: '#6B7280' }}>
					<p>
						Miras Car Rental is your trusted partner for exploring the breathtaking landscapes of Kashmir. With years of experience in the travel and transportation industry, we've built our reputation on{' '}
						<strong style={{ color: '#1A1A1A' }}>reliability, quality, and customer satisfaction</strong>.
					</p>

					<div className='card-glass p-8'>
						<h2 className='font-display font-bold mb-4' style={{ fontSize: '1.3rem', color: '#1A1A1A' }}>Our Mission</h2>
						<p>To provide premium car rental services and authentic travel experiences that transform the way people explore Kashmir. We believe in empowering travelers with the freedom to discover this paradise at their own pace.</p>
					</div>

					<div className='card-glass p-8'>
						<h2 className='font-display font-bold mb-4' style={{ fontSize: '1.3rem', color: '#1A1A1A' }}>Why Choose Miras?</h2>
						<ul className='space-y-3'>
							{[
								'Wide range of vehicles for every budget and requirement',
								'24/7 roadside assistance and customer support',
								'Transparent pricing with no hidden charges',
								'Expert local drivers who know every inch of the valley',
								'Fully insured vehicles with comprehensive coverage',
								'Flexible booking and free cancellation policies',
								'Airport pickup, hotel delivery, and railway station drops',
							].map((item) => (
								<li key={item} className='flex items-start gap-3'>
									<span style={{ color: '#C5A059', fontWeight: 'bold' }}>✓</span>
									<span>{item}</span>
								</li>
							))}
						</ul>
					</div>

					<div className='card-glass p-8'>
						<h2 className='font-display font-bold mb-4' style={{ fontSize: '1.3rem', color: '#1A1A1A' }}>Our Fleet</h2>
						<p>From economical hatchbacks to luxury SUVs, we maintain a diverse fleet of well-maintained vehicles. Every car is regularly serviced and thoroughly inspected to ensure your safety and comfort on every journey through the valley.</p>
					</div>
				</div>

				{/* Stats */}
				<div className='grid grid-cols-1 sm:grid-cols-3 gap-6 mt-14'>
					{[
						{ num: '12+', label: 'Premium Vehicles', icon: '🚗', color: 'rgba(47,164,169,0.12)', textColor: '#003366' },
						{ num: '500+', label: 'Happy Travelers', icon: '😊', color: 'rgba(197,160,89,0.12)', textColor: '#C5A059' },
						{ num: '4.8★', label: 'Google Rating', icon: '⭐', color: 'rgba(47,164,169,0.12)', textColor: '#003366' },
					].map((stat) => (
						<div key={stat.label} className='card-glass p-6 text-center'>
							<div className='text-4xl mb-3'>{stat.icon}</div>
							<p className='text-3xl font-extrabold mb-1' style={{ color: stat.textColor }}>{stat.num}</p>
							<p className='text-sm' style={{ color: '#6B7280' }}>{stat.label}</p>
						</div>
					))}
				</div>

				{/* CTA */}
				<div className='mt-14 card-glass p-10 text-center' style={{ background: 'linear-gradient(135deg, rgba(47,164,169,0.15), rgba(107,193,183,0.1))' }}>
					<h3 className='text-2xl font-display font-bold mb-3' style={{ color: '#1A1A1A' }}>Ready to Explore?</h3>
					<p className='mb-8' style={{ color: '#6B7280' }}>Start your Kashmir adventure with Miras today</p>
					<div className='flex flex-col sm:flex-row gap-4 justify-center'>
						<Link to='/cars' className='btn-blue px-7 py-3 justify-center'>Browse Our Fleet</Link>
						<Link to='/contact' className='btn-ghost-white px-7 py-3 justify-center' style={{ background: 'rgba(47,164,169,0.12)', color: '#003366', borderColor: 'rgba(47,164,169,0.3)' }}>
							Contact Us
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
