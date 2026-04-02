import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { carsAPI } from '../utils/api';
import { Users, Zap, Fuel, Gauge, Search } from 'lucide-react';
import toast from 'react-hot-toast';

const CATEGORIES = [
	'All',
	'SUV',
	'Sedan',
	'Hatchback',
	'Luxury',
	'MUV',
];

// Returns true if the car has an ongoing booking (confirmed by cron once pickup date is reached)
function isCarBooked(car) {
	return car.currentBooking?.status === 'ongoing'
}

export default function Cars() {
	const [cars, setCars] = useState([]);
	const [loading, setLoading] = useState(true);
	const [selectedCategory, setSelectedCategory] = useState('All');
	const [searchTerm, setSearchTerm] = useState('');

	useEffect(() => {
		const fetchCars = async () => {
			try {
				const res = await carsAPI.getAll({
					category:
						selectedCategory === 'All' ? undefined : selectedCategory,
				});
				setCars(res.data?.data || []);
			} catch {
				toast.error('Failed to load cars');
			} finally {
				setLoading(false);
			}
		};
		fetchCars();
	}, [selectedCategory]);

	const filteredCars = cars.filter(
		(car) =>
			car.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
			car.category?.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	return (
		<div style={{ background: '#F8F9FA' }}>
			{/* ── Header ──────────────────────────────── */}
			<section
				className='py-20 relative overflow-hidden'
				style={{
					background:
						'linear-gradient(135deg, #003366 0%, #004080 100%)',
				}}>
				<div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					<span className='section-label mb-3 block'>
						Choose Your Ride
					</span>
					<h1
						className='font-display font-bold text-white mb-3'
						style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
						Our Premium Fleet
					</h1>
					<p
						className='text-lg'
						style={{ color: 'rgba(255,255,255,0.8)' }}>
						From rugged SUVs to luxury sedans — pick the perfect car
						for your Kashmir trip
					</p>
				</div>
				{/* Wavy bottom */}
				<div className='absolute bottom-0 left-0 w-full'>
					<svg
						viewBox='0 0 1440 80'
						fill='none'
						xmlns='http://www.w3.org/2000/svg'
						className='w-full'
						preserveAspectRatio='none'
						style={{ height: '70px' }}>
						<path
							d='M0,35 C320,80 640,10 960,45 C1200,65 1380,30 1440,25 L1440,80 L0,80 Z'
							fill='#F8F9FA'
						/>
					</svg>
				</div>
			</section>

			{/* ── Filters & Search ────────────────────── */}
			<section
				className='py-8  top-[72px] z-40'
				style={{
					background: 'rgba(248,249,250,0.85)',
					backdropFilter: 'blur(16px)',
					borderBottom: '1px solid rgba(0,0,0,0.05)',
				}}>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='flex flex-col gap-4'>
						{/* Search */}
						<div className='relative'>
							<Search
								size={18}
								className='absolute left-4 top-1/2 -translate-y-1/2'
								style={{ color: '#6B7280' }}
							/>
							<input
								type='text'
								placeholder='Search by car name or category...'
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className='input-glass pl-11'
							/>
						</div>
						{/* Category Filter */}
						<div className='flex flex-wrap gap-2'>
							{CATEGORIES.map((cat) => (
								<button
									key={cat}
									onClick={() => setSelectedCategory(cat)}
									className={`filter-pill ${selectedCategory === cat ? 'active' : ''}`}>
									{cat}
								</button>
							))}
						</div>
					</div>
				</div>
			</section>

			{/* ── Cars Grid ───────────────────────────── */}
			<section className='py-16'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					{loading ? (
						<div className='flex justify-center py-20'>
							<div
								className='w-12 h-12 border-4 rounded-full animate-spin'
								style={{
									borderColor: 'rgba(0,51,102,0.2)',
									borderTopColor: '#003366',
								}}
							/>
						</div>
					) : filteredCars.length > 0 ? (
						<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
							{filteredCars.map((car) => (
								<Link
									key={car._id}
									to={`/cars/${car.slug}`}
									className='car-card group'>
									{car.images?.[0] && (
										<div className='h-52 overflow-hidden relative'>
											<img
												src={car.images[0]}
												alt={car.name}
												className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500'
											/>
											{car.isFeatured && (
												<div className='absolute top-3 right-3'>
													<span className='tag-gold'>FEATURED</span>
												</div>
											)}
											{isCarBooked(car) && (
												<div className='absolute top-3 left-1/2 -translate-x-1/2'>
													<span
														className='px-3 py-1 text-xs font-bold rounded-full'
														style={{ background: '#DC2626', color: '#fff' }}>
														BOOKED
													</span>
												</div>
											)}
											<div className='absolute bottom-3 left-3'>
												<span className='tag'>{car.category}</span>
											</div>
										</div>
									)}
									<div className='p-5'>
										<h3
											className='text-base font-bold mb-1'
											style={{ color: '#1A1A1A' }}>
											{car.name}
										</h3>

										{/* Specs */}
										<div
											className='grid grid-cols-2 gap-2 mb-4 text-xs'
											style={{ color: '#6B7280' }}>
											<span className='flex items-center gap-1'>
												<Users size={12} /> {car.seats} Seats
											</span>
											<span className='flex items-center gap-1'>
												<Zap size={12} /> {car.transmission}
											</span>
											<span className='flex items-center gap-1'>
												<Fuel size={12} /> {car.fuelType}
											</span>
											{car.modelYear && (
												<span className='flex items-center gap-1'>
													<Gauge size={12} /> {car.modelYear}
												</span>
											)}
										</div>

										{/* Features */}
										{car.features && car.features.length > 0 && (
											<div className='flex flex-wrap gap-1.5 mb-4'>
												{car.features
													.slice(0, 3)
													.map((feature, i) => (
														<span
															key={i}
															className='px-2 py-0.5 text-xs rounded-full'
															style={{
																background: 'rgba(0,51,102,0.08)',
																color: '#003366',
															}}>
															{feature}
														</span>
													))}
												{car.features.length > 3 && (
													<span
														className='text-xs'
														style={{ color: '#6B7280' }}>
														+{car.features.length - 3}
													</span>
												)}
											</div>
										)}

										{/* Pricing & CTA */}
										<div
											className='flex items-center justify-between pt-4'
											style={{
												borderTop: '1px solid rgba(0,0,0,0.06)',
											}}>
											<div>
												<span
													className='text-2xl font-extrabold'
													style={{
														background:
															'linear-gradient(135deg, #C5A059, #D4B06A)',
														WebkitBackgroundClip: 'text',
														WebkitTextFillColor: 'transparent',
													}}>
													₹{car.pricePerDay?.toLocaleString()}
												</span>
												<span
													className='text-sm'
													style={{ color: '#6B7280' }}>
													/day
												</span>
											</div>
											<span
												className='text-sm font-semibold'
												style={{ color: '#C5A059' }}>
												View Details →
											</span>
										</div>
									</div>
								</Link>
							))}
						</div>
					) : (
						<div
							className='text-center py-20'
							style={{ color: '#6B7280' }}>
							<div className='text-5xl mb-4'>🚗</div>
							<p className='text-lg font-semibold'>No cars found</p>
							<p className='text-sm mt-1'>
								Try a different category or search term
							</p>
						</div>
					)}
				</div>
			</section>
		</div>
	);
}
