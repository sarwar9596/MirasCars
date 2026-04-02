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
					carsAPI.getAll({ limit: 6 }),
					blogsAPI.getAll({ limit: 4 }),
				]);
				setBlog(blogRes.data?.data || blogRes.data);
				setRelatedCars((carsRes.data?.data || []).slice(0, 3));
				const all = blogsListRes.data?.data || [];
				setMoreBlogs(all.filter(b => b.slug !== slug).slice(0, 3));
			} catch {
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
			<div className='min-h-screen flex items-center justify-center' style={{ background: '#F8F9FA' }}>
				<div className='w-12 h-12 border-4 rounded-full animate-spin' style={{ borderColor: 'rgba(47,164,169,0.2)', borderTopColor: '#003366' }} />
			</div>
		);
	}

	if (!blog) return null;

	return (
		<div>
			{/* ── Header ──────────────────────────────── */}
			<section className='py-20 relative overflow-hidden' style={{ background: 'linear-gradient(135deg, #003366 0%, #004080 100%)' }}>
				<div className='absolute bottom-0 left-0 w-full'>
					<svg viewBox='0 0 1440 80' fill='none' xmlns='http://www.w3.org/2000/svg' className='w-full' preserveAspectRatio='none' style={{ height: '70px' }}>
						<path d='M0,40 C320,80 640,10 960,45 C1200,65 1380,30 1440,25 L1440,80 L0,80 Z' fill='white' />
					</svg>
				</div>
			</section>

			<div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10'>

				{/* Featured Image */}
				{blog.featuredImage && (
					<div className='rounded-3xl overflow-hidden mb-8 h-72 md:h-96 shadow-lg'>
						<img src={blog.featuredImage} alt={blog.title} className='w-full h-full object-cover' />
					</div>
				)}

				{/* Meta */}
				<div className='flex flex-wrap items-center gap-4 mb-6 pb-6' style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
					<span className='tag'>{blog.category || 'Travel Guide'}</span>
					<div className='flex items-center gap-1.5 text-sm' style={{ color: '#6B7280' }}>
						<User size={14} /><span>{blog.author || 'Miras Team'}</span>
					</div>
					<div className='flex items-center gap-1.5 text-sm' style={{ color: '#6B7280' }}>
						<Calendar size={14} /><span>{formatDistanceToNow(new Date(blog.createdAt), { addSuffix: true })}</span>
					</div>
					<div className='flex items-center gap-1.5 text-sm' style={{ color: '#6B7280' }}>
						<Eye size={14} /><span>{blog.views || 0} views</span>
					</div>
					{blog.readTime && <span className='text-sm' style={{ color: '#6B7280' }}>· {blog.readTime}</span>}
				</div>

				{/* Title & Excerpt */}
				<div className='mb-8'>
					<h1 className='font-display font-bold mb-4' style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', color: '#1A1A1A' }}>{blog.title}</h1>
					{blog.excerpt && (
						<p className='text-lg italic leading-relaxed pl-4' style={{ color: '#6B7280', borderLeft: '4px solid #C5A059' }}>
							{blog.excerpt}
						</p>
					)}
				</div>

				{/* Content */}
				<div className='mb-16'>
					<div
						className='leading-relaxed blog-content'
						style={{ lineHeight: '1.9', fontSize: '16px', color: '#6B7280' }}
						dangerouslySetInnerHTML={{ __html: blog.content }}
					/>
				</div>

				{/* Tags */}
				{blog.tags && blog.tags.length > 0 && (
					<div className='mb-12 pb-12' style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
						<p className='text-sm font-bold mb-3' style={{ color: '#1A1A1A' }}>Tags</p>
						<div className='flex flex-wrap gap-2'>
							{blog.tags.map((tag, i) => (
								<span key={i}
									className='px-3 py-1 text-sm rounded-full transition-colors cursor-pointer'
									style={{ background: 'rgba(0,0,0,0.04)', color: '#6B7280' }}>
									#{tag}
								</span>
							))}
						</div>
					</div>
				)}

				{/* CTA */}
				<div className='card-glass p-10 text-center mb-16' style={{ background: 'linear-gradient(135deg, rgba(47,164,169,0.12), rgba(107,193,183,0.08))' }}>
					<h3 className='text-2xl font-display font-extrabold mb-3' style={{ color: '#1A1A1A' }}>
						Ready to Explore Kashmir?
					</h3>
					<p className='mb-8' style={{ color: '#6B7280' }}>Book your perfect car today and experience the valley with Miras</p>
					<Link to='/cars' className='btn-blue px-7 py-3 justify-center'>View Our Fleet</Link>
				</div>

				{/* Related Cars */}
				{relatedCars.length > 0 && (
					<div className='mb-16'>
						<h2 className='font-display font-bold mb-8' style={{ fontSize: '1.5rem', color: '#1A1A1A' }}>Cars for Your Trip</h2>
						<div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
							{relatedCars.map((car) => (
								<Link key={car._id} to={`/cars/${car.slug}`} className='car-card group'>
									{car.images?.[0] && (
										<div className='h-40 overflow-hidden'>
											<img src={car.images[0]} alt={car.name}
												className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500' />
										</div>
									)}
									<div className='p-4'>
										<h3 className='font-bold mb-1' style={{ color: '#1A1A1A' }}>{car.name}</h3>
										<p className='text-xs font-semibold mb-2' style={{ color: '#6B7280' }}>{car.category}</p>
										<div className='flex items-baseline gap-1'>
											<span className='text-lg font-extrabold' style={{ background: 'linear-gradient(135deg, #C5A059, #D4B06A)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>₹{car.pricePerDay?.toLocaleString()}</span>
											<span className='text-xs' style={{ color: '#6B7280' }}>/day</span>
										</div>
									</div>
								</Link>
							))}
						</div>
					</div>
				)}
			</div>

			{/* More Articles */}
			{moreBlogs.length > 0 && (
				<section className='py-16' style={{ background: '#F8F9FA' }}>
					<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
						<div className='flex items-end justify-between mb-8'>
							<div>
								<span className='section-label mb-2 block'>Keep Reading</span>
								<h2 className='font-display font-bold' style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', color: '#1A1A1A' }}>More Travel Guides</h2>
							</div>
						</div>
						<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
							{moreBlogs.map((b) => (
								<Link key={b._id} to={`/blog/${b.slug}`} className='blog-card group'>
									{b.featuredImage && (
										<div className='h-44 overflow-hidden'>
											<img src={b.featuredImage} alt={b.title}
												className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500' />
										</div>
									)}
									<div className='p-5'>
										<span className='tag mb-2'>{b.category || 'Travel'}</span>
										<h3 className='text-base font-bold mb-2 line-clamp-2' style={{ color: '#1A1A1A' }}>{b.title}</h3>
										<p className='text-xs line-clamp-2 mb-3' style={{ color: '#6B7280' }}>{b.excerpt}</p>
										<span className='text-xs font-semibold' style={{ color: '#C5A059' }}>Read Article →</span>
									</div>
								</Link>
							))}
						</div>
					</div>
				</section>
			)}
		</div>
	);
}
