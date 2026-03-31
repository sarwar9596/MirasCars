import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { blogsAPI, carsAPI } from '../utils/api';
import { ArrowLeft, Eye, Calendar, User, Share2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

export default function BlogDetail() {
	const { slug } = useParams();
	const navigate = useNavigate();
	const [blog, setBlog] = useState(null);
	const [relatedCars, setRelatedCars] = useState([]);
	const [moreBlogs, setMoreBlogs] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [blogRes, carsRes, blogsListRes] = await Promise.all([
					blogsAPI.getBySlug(slug),
					carsAPI.getAll({ featured: true }),
					blogsAPI.getAll({ limit: 4 }),
				]);
				setBlog(blogRes.data?.data || blogRes.data);
				setRelatedCars((carsRes.data?.data || []).slice(0, 3));
				// Exclude current blog from "more articles"
				const all = blogsListRes.data?.data || [];
				setMoreBlogs(all.filter(b => b.slug !== slug).slice(0, 3));
			} catch (err) {
				toast.error('Blog post not found');
				navigate('/blogs');
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, [slug, navigate]);

	if (loading) {
		return (
			<div className='min-h-screen flex items-center justify-center bg-dark-900'>
				<div className='w-12 h-12 border-3 border-brand-gold/30 border-t-brand-gold rounded-full animate-spin'></div>
			</div>
		);
	}

	if (!blog) return null;

	return (
		<div className='min-h-screen bg-dark-900'>
			{/* Header */}
			<div className='bg-dark-800 border-b border-dark-400/30 py-4 sticky top-0 z-40'>
				<div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between'>
					<button
						onClick={() => navigate('/blogs')}
						className='flex items-center gap-2 text-gray-400 hover:text-brand-gold transition-colors text-sm'>
						<ArrowLeft size={18} /> Back to Blogs
					</button>
					<button
						onClick={() => toast.success('Link copied!')}
						className='p-2 rounded-lg bg-dark-600 text-gray-400 hover:text-brand-gold transition-all'>
						<Share2 size={18} />
					</button>
				</div>
			</div>

			<div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
				{/* Featured Image */}
				{blog.featuredImage && (
					<div className='rounded-2xl overflow-hidden mb-8 h-96 bg-dark-800'>
						<img
							src={blog.featuredImage}
							alt={blog.title}
							className='w-full h-full object-cover'
						/>
					</div>
				)}

				{/* Meta Info */}
				<div className='flex flex-wrap items-center gap-4 mb-6 pb-6 border-b border-dark-400/30'>
					<span className='px-3 py-1 bg-brand-gold/10 text-brand-gold text-xs font-bold rounded-full'>
						{blog.category}
					</span>
					<div className='flex items-center gap-2 text-sm text-gray-400'>
						<User size={16} />
						<span>{blog.author || 'Miras Team'}</span>
					</div>
					<div className='flex items-center gap-2 text-sm text-gray-400'>
						<Calendar size={16} />
						<span>
							{formatDistanceToNow(new Date(blog.createdAt), {
								addSuffix: true,
							})}
						</span>
					</div>
					<div className='flex items-center gap-2 text-sm text-gray-400'>
						<Eye size={16} />
						<span>{blog.views || 0} views</span>
					</div>
					{blog.readTime && (
						<span className='text-sm text-gray-400'>
							• {blog.readTime}
						</span>
					)}
				</div>

				{/* Title & Excerpt */}
				<div className='mb-8'>
					<h1 className='heading-2 mb-4'>{blog.title}</h1>
					{blog.excerpt && (
						<p className='text-xl text-gray-300 italic'>
							{blog.excerpt}
						</p>
					)}
				</div>

				{/* Content */}
				<div className='prose prose-invert max-w-none mb-16'>
					<div
						className='text-gray-300 leading-relaxed text-lg blog-content'
						dangerouslySetInnerHTML={{ __html: blog.content }}
					/>
				</div>

				{/* Tags */}
				{blog.tags && blog.tags.length > 0 && (
					<div className='mb-12 pb-12 border-b border-dark-400/30'>
						<h3 className='text-sm font-semibold text-gray-400 mb-3'>
							Tags
						</h3>
						<div className='flex flex-wrap gap-2'>
							{blog.tags.map((tag, i) => (
								<span
									key={i}
									className='px-3 py-1.5 bg-dark-800 text-gray-300 text-sm rounded-lg hover:bg-dark-700 transition-colors cursor-pointer'>
									#{tag}
								</span>
							))}
						</div>
					</div>
				)}

				{/* Related Cars */}
				{relatedCars.length > 0 && (
					<div className='mb-16'>
						<h2 className='heading-3 mb-8'>Featured Vehicles</h2>
						<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
							{relatedCars.map((car) => (
								<Link
									key={car._id}
									to={`/cars/${car.slug}`}
									className='card card-hover overflow-hidden group'>
									{car.images?.[0] && (
										<div className='h-48 bg-dark-700 overflow-hidden'>
											<img
												src={car.images[0]}
												alt={car.name}
												className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
											/>
										</div>
									)}
									<div className='p-4'>
										<h3 className='font-semibold text-white mb-1'>
											{car.name}
										</h3>
										<p className='text-brand-gold text-xs font-medium mb-3'>
											{car.category}
										</p>
										<div className='flex items-baseline gap-1'>
											<span className='text-lg font-bold text-white'>
												₹{car.pricePerDay}
											</span>
											<span className='text-gray-400 text-xs'>
												/day
											</span>
										</div>
									</div>
								</Link>
							))}
						</div>
					</div>
				)}

				{/* CTA */}
				<div className='bg-gradient-to-r from-brand-gold/10 to-brand-gold/5 border border-brand-gold/20 rounded-2xl p-8 text-center'>
					<h3 className='text-2xl font-bold text-white mb-3'>
						Ready to Explore Kashmir?
					</h3>
					<p className='text-gray-400 mb-6'>
						Book your perfect car today and experience the adventure
					</p>
					<Link to='/cars' className='btn-gold'>
						View Our Fleet
					</Link>
				</div>
			</div>

			{/* Recommended Articles */}
			{moreBlogs.length > 0 && (
				<section className='py-16 bg-dark-800'>
					<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
						<h2 className='heading-3 mb-8'>More Articles</h2>
						<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
							{moreBlogs.map((b) => (
								<Link
									key={b._id}
									to={`/blog/${b.slug}`}
									className='card card-hover p-6 group'>
									{b.featuredImage && (
										<div className='h-40 bg-dark-700 rounded-lg mb-4 overflow-hidden'>
											<img
												src={b.featuredImage}
												alt={b.title}
												className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
											/>
										</div>
									)}
									<p className='text-brand-gold text-xs font-semibold mb-2'>
										{b.category || 'Travel Guide'}
									</p>
									<h3 className='text-lg font-semibold text-white mb-2 line-clamp-2'>
										{b.title}
									</h3>
									<p className='text-gray-400 text-sm line-clamp-2'>
										{b.excerpt}
									</p>
								</Link>
							))}
						</div>
					</div>
				</section>
			)}
		</div>
	);
}
