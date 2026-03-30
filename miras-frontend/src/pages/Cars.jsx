import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { carsAPI } from '../utils/api';
import { Users, Zap, Fuel, Gauge } from 'lucide-react';
import toast from 'react-hot-toast';

const CATEGORIES = [
	'All',
	'SUV',
	'Sedan',
	'Hatchback',
	'Luxury',
	'MUV',
];

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
					available: true,
				});
				setCars(res.data?.data || []);
			} catch (err) {
				console.error('Error fetching cars:', err);
				toast.error('Failed to load cars');
			} finally {
				setLoading(false);
			}
		};
		fetchCars();
	}, [selectedCategory]);

	const filteredCars = cars.filter(
		(car) =>
			car.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			car.category.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	return (
		<div>
			{/* Header */}
			<section className='bg-gradient-to-br from-dark-800 to-dark-900 py-16'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					<h1 className='heading-2 mb-4'>Our Fleet</h1>
					<p className='text-gray-400 text-lg'>
						Choose from our wide range of premium vehicles
					</p>
				</div>
			</section>

			{/* Filters & Search */}
			<section className='bg-dark-900 border-b border-dark-400/30 py-8'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='flex flex-col gap-6'>
						{/* Search */}
						<input
							type='text'
							placeholder='Search by car name or category...'
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className='input'
						/>

						{/* Category Filter */}
						<div className='flex flex-wrap gap-2'>
							{CATEGORIES.map((cat) => (
								<button
									key={cat}
									onClick={() => setSelectedCategory(cat)}
									className={`px-6 py-2 rounded-xl font-medium transition-all ${
										selectedCategory === cat
											? 'bg-brand-gold text-dark-900 shadow-gold'
											: 'bg-dark-600 text-gray-300 hover:text-brand-gold border border-dark-400'
									}`}>
									{cat}
								</button>
							))}
						</div>
					</div>
				</div>
			</section>

			{/* Cars Grid */}
			<section className='py-20 bg-dark-900'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					{loading ? (
						<div className='flex justify-center py-20'>
							<div className='w-12 h-12 border-3 border-brand-gold/30 border-t-brand-gold rounded-full animate-spin'></div>
						</div>
					) : filteredCars.length > 0 ? (
						<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
							{filteredCars.map((car) => (
								<Link
									key={car._id}
									to={`/cars/${car.slug}`}
									className='card card-hover group overflow-hidden'>
									{car.images?.[0] && (
										<div className='h-64 bg-dark-700 overflow-hidden relative'>
											<img
												src={car.images[0]}
												alt={car.name}
												className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
											/>
											{car.isFeatured && (
												<div className='absolute top-3 right-3 bg-brand-gold text-dark-900 px-3 py-1 rounded-lg text-xs font-bold'>
													FEATURED
												</div>
											)}
										</div>
									)}
									<div className='p-6'>
										<h3 className='text-xl font-semibold text-white mb-1'>
											{car.name}
										</h3>
										<p className='text-brand-gold text-sm font-medium mb-4'>
											{car.category}
										</p>

										{/* Specs */}
										<div className='grid grid-cols-2 gap-3 mb-4 text-xs text-gray-400'>
											<div className='flex items-center gap-2'>
												<Users size={14} />
												<span>{car.seats} Seats</span>
											</div>
											<div className='flex items-center gap-2'>
												<Fuel size={14} />
												<span>{car.fuelType}</span>
											</div>
											<div className='flex items-center gap-2'>
												<Zap size={14} />
												<span>{car.transmission}</span>
											</div>
											{car.modelYear && (
												<div className='flex items-center gap-2'>
													<Gauge size={14} />
													<span>{car.modelYear}</span>
												</div>
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
															className='px-2 py-0.5 bg-dark-600/50 text-gray-400 text-xs rounded'>
															{feature}
														</span>
													))}
												{car.features.length > 3 && (
													<span className='px-2 py-0.5 text-gray-500 text-xs'>
														+{car.features.length - 3} more
													</span>
												)}
											</div>
										)}

										{/* Pricing */}
										<div className='mb-4 pb-4 border-t border-dark-400/30'>
											<div className='flex items-baseline gap-2 mt-4'>
												<span className='text-2xl font-bold text-white'>
													₹{car.pricePerDay}
												</span>
												<span className='text-gray-400 text-sm'>
													/day
												</span>
											</div>
											{car.pricePerWeek && (
												<div className='text-gray-500 text-xs mt-1'>
													₹{car.pricePerWeek} /week
												</div>
											)}
										</div>

										<button className='w-full btn-gold py-2 text-sm font-medium'>
											View Details
										</button>
									</div>
								</Link>
							))}
						</div>
					) : (
						<div className='text-center py-20 text-gray-400'>
							<p>No cars found matching your criteria</p>
						</div>
					)}
				</div>
			</section>
		</div>
	);
}
