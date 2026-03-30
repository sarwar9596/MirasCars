import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { carsAPI, blogsAPI } from '../utils/api';
import { ArrowRight, MapPin, Users, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Home() {
	const [featuredCars, setFeaturedCars] = useState([]);
	const [recentBlogs, setRecentBlogs] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [carsRes, blogsRes] = await Promise.all([
					carsAPI.getFeatured(),
					blogsAPI.getAll({ limit: 3 }),
				]);
				setFeaturedCars(carsRes.data?.data || []);
				setRecentBlogs(blogsRes.data?.data || []);
			} catch (err) {
				console.error('Error fetching data:', err);
				toast.error('Failed to load featured content');
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, []);

	return (
		<div>
			{/* Hero Section */}
			<section className='relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-dark-900 to-dark-800'>
				<div className='absolute inset-0 opacity-30'>
					<div className='absolute top-20 right-10 w-72 h-72 bg-brand-gold/20 rounded-full blur-3xl'></div>
					<div className='absolute bottom-20 left-10 w-96 h-96 bg-brand-gold/10 rounded-full blur-3xl'></div>
				</div>

				<div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20'>
					<div className='inline-block mb-6'>
						<span className='px-4 py-2 rounded-full bg-brand-gold/10 border border-brand-gold/30 text-brand-gold text-sm font-medium'>
							Welcome to Miras
						</span>
					</div>
					<h1 className='heading-1 mb-6'>Explore Kashmir in Style</h1>
					<p className='text-xl text-gray-300 max-w-2xl mx-auto mb-10'>
						Premium car rentals and authentic travel guides. Drive
						through breathtaking landscapes with complete peace of
						mind.
					</p>
					<div className='flex flex-col sm:flex-row gap-4 justify-center'>
						<Link
							to='/cars'
							className='btn-gold inline-flex items-center justify-center gap-2'>
							Explore Fleet <ArrowRight size={18} />
						</Link>
						<Link
							to='/contact'
							className='btn-outline inline-flex items-center justify-center gap-2'>
							Book Now <ArrowRight size={18} />
						</Link>
					</div>
				</div>
			</section>

			{/* Featured Cars Section */}
			<section className='py-20 bg-dark-900'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='text-center mb-16'>
						<h2 className='heading-2 mb-4'>Featured Fleet</h2>
						<p className='text-gray-400 max-w-2xl mx-auto'>
							Handpicked vehicles for your Kashmir adventure
						</p>
					</div>

					{loading ? (
						<div className='flex justify-center py-16'>
							<div className='w-12 h-12 border-3 border-brand-gold/30 border-t-brand-gold rounded-full animate-spin'></div>
						</div>
					) : featuredCars.length > 0 ? (
						<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
							{featuredCars.slice(0, 3).map((car) => (
								<Link
									key={car._id}
									to={`/cars/${car.slug}`}
									className='card card-hover overflow-hidden group'>
									{car.images?.[0] && (
										<div className='h-64 bg-dark-700 overflow-hidden'>
											<img
												src={car.images[0]}
												alt={car.name}
												className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
											/>
										</div>
									)}
									<div className='p-6'>
										<h3 className='text-xl font-semibold text-white mb-2'>
											{car.name}
										</h3>
										<p className='text-brand-gold text-sm font-medium mb-4'>
											{car.category}
										</p>
										<div className='flex items-center gap-3 text-gray-400 text-sm mb-4'>
											<Users size={16} />
											<span>{car.seats} Seats</span>
											<Zap size={16} />
											<span>{car.fuelType}</span>
										</div>
										<div className='flex items-baseline gap-2 mb-4'>
											<span className='text-2xl font-bold text-white'>
												₹{car.pricePerDay}
											</span>
											<span className='text-gray-400 text-sm'>
												/day
											</span>
										</div>
										<button className='w-full btn-gold py-2 text-sm font-medium'>
											View Details
										</button>
									</div>
								</Link>
							))}
						</div>
					) : (
						<div className='text-center py-16 text-gray-400'>
							No featured cars available yet
						</div>
					)}

					<div className='text-center mt-12'>
						<Link to='/cars' className='btn-outline'>
							View All Vehicles
						</Link>
					</div>
				</div>
			</section>

			{/* Recent Blogs Section */}
			<section className='py-20 bg-dark-800'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='text-center mb-16'>
						<h2 className='heading-2 mb-4'>
							Travel Guides & Stories
						</h2>
						<p className='text-gray-400 max-w-2xl mx-auto'>
							Tips, guides, and inspiring stories from Kashmir
						</p>
					</div>

					{recentBlogs.length > 0 ? (
						<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
							{recentBlogs.map((blog) => (
								<Link
									key={blog._id}
									to={`/blog/${blog.slug}`}
									className='card card-hover group overflow-hidden'>
									{blog.featuredImage && (
										<div className='h-48 bg-dark-700 overflow-hidden'>
											<img
												src={blog.featuredImage}
												alt={blog.title}
												className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
											/>
										</div>
									)}
									<div className='p-6'>
										<span className='inline-block px-3 py-1 mb-3 bg-brand-gold/10 text-brand-gold text-xs font-medium rounded-full'>
											{blog.category}
										</span>
										<h3 className='text-lg font-semibold text-white mb-2 line-clamp-2'>
											{blog.title}
										</h3>
										<p className='text-gray-400 text-sm line-clamp-2 mb-4'>
											{blog.excerpt}
										</p>
										<div className='flex items-center justify-between text-xs text-gray-500'>
											<span>{blog.readTime || '5 min read'}</span>
											<span>👁️ {blog.views || 0} views</span>
										</div>
									</div>
								</Link>
							))}
						</div>
					) : (
						<div className='text-center py-16 text-gray-400'>
							No blog posts available yet
						</div>
					)}

					<div className='text-center mt-12'>
						<Link to='/blogs' className='btn-outline'>
							Read All Articles
						</Link>
					</div>
				</div>
			</section>

			{/* Why Choose Us */}
			<section className='py-20 bg-dark-900'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					<h2 className='heading-2 text-center mb-16'>
						Why Choose Miras?
					</h2>
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
						{[
							{
								icon: '🚗',
								title: 'Premium Fleet',
								desc: 'Well-maintained vehicles for every need',
							},
							{
								icon: '💰',
								title: 'Best Prices',
								desc: 'Competitive rates with no hidden charges',
							},
							{
								icon: '🛡️',
								title: 'Safe & Secure',
								desc: '24/7 roadside assistance and insurance',
							},
							{
								icon: '👥',
								title: 'Expert Guides',
								desc: 'Local knowledge and personalized service',
							},
						].map((item, i) => (
							<div key={i} className='card p-6 text-center'>
								<div className='text-5xl mb-4'>{item.icon}</div>
								<h3 className='text-lg font-semibold text-white mb-2'>
									{item.title}
								</h3>
								<p className='text-gray-400 text-sm'>{item.desc}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className='py-20 bg-gradient-to-r from-brand-gold/10 to-brand-gold/5 border-y border-brand-gold/20'>
				<div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
					<h2 className='heading-2 mb-6'>
						Ready for Your Kashmir Adventure?
					</h2>
					<p className='text-xl text-gray-300 mb-8'>
						Start your journey with us today
					</p>
					<Link to='/contact' className='btn-gold'>
						Book Your Ride Now
					</Link>
				</div>
			</section>
		</div>
	);
}
