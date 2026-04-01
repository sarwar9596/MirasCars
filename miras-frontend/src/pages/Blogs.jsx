import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { blogsAPI } from '../utils/api';
import { Eye, Calendar, User, Search } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

export default function Blogs() {
	const [blogs, setBlogs] = useState([]);
	const [loading, setLoading] = useState(true);
	const [selectedCategory, setSelectedCategory] = useState('All');
	const [searchTerm, setSearchTerm] = useState('');

	const categories = ['All', 'Travel', 'Kashmir Guide', 'Car Tips', 'Season Guide', 'News', 'Adventure'];

	useEffect(() => {
		const fetchBlogs = async () => {
			try {
				const res = await blogsAPI.getAll({ limit: 50 });
				setBlogs(res.data?.data || []);
			} catch {
				toast.error('Failed to load blog posts');
			} finally {
				setLoading(false);
			}
		};
		fetchBlogs();
	}, []);

	const filteredBlogs = blogs.filter((blog) => {
		const matchCategory = selectedCategory === 'All' || blog.category === selectedCategory;
		const matchSearch =
			blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
			(blog.excerpt || '').toLowerCase().includes(searchTerm.toLowerCase());
		return matchCategory && matchSearch;
	});

	return (
		<div style={{ background: '#F8F9FA' }}>
			{/* ── Header ──────────────────────────────── */}
			<section className='py-20 relative overflow-hidden' style={{ background: 'linear-gradient(135deg, #2FA4A9 0%, #6BC1B7 45%, #F5E6CA 100%)' }}>
				<div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					<span className='section-label mb-3 block'>Our Blog</span>
					<h1 className='font-display font-bold text-white' style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>Travel Guides & Stories</h1>
					<p className='text-lg mt-2' style={{ color: 'rgba(255,255,255,0.8)' }}>Tips, guides, and inspiring stories from Kashmir</p>
				</div>
				<div className='absolute bottom-0 left-0 w-full'>
					<svg viewBox='0 0 1440 80' fill='none' xmlns='http://www.w3.org/2000/svg' className='w-full' preserveAspectRatio='none' style={{ height: '70px' }}>
						<path d='M0,35 C320,80 640,10 960,45 C1200,65 1380,30 1440,25 L1440,80 L0,80 Z' fill='#F8F9FA' />
					</svg>
				</div>
			</section>

			{/* ── Filters & Search ────────────────────── */}
			<section className='py-8 sticky top-[72px] z-40' style={{ background: 'rgba(248,249,250,0.88)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='flex flex-col gap-4'>
						<div className='relative'>
							<Search size={18} className='absolute left-4 top-1/2 -translate-y-1/2' style={{ color: '#6B7280' }} />
							<input type='text' placeholder='Search blog posts...' value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)} className='input-glass pl-11' />
						</div>
						<div className='flex flex-wrap gap-2'>
							{categories.map((cat) => (
								<button key={cat} onClick={() => setSelectedCategory(cat)}
									className={`filter-pill ${selectedCategory === cat ? 'active' : ''}`}>
									{cat}
								</button>
							))}
						</div>
					</div>
				</div>
			</section>

			{/* ── Blogs ──────────────────────────────── */}
			<section className='py-16'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					{loading ? (
						<div className='flex justify-center py-20'>
							<div className='w-12 h-12 border-4 rounded-full animate-spin' style={{ borderColor: 'rgba(47,164,169,0.2)', borderTopColor: '#2FA4A9' }} />
						</div>
					) : filteredBlogs.length > 0 ? (
						<>
							{/* Featured Post */}
							{filteredBlogs[0] && (
								<Link to={`/blog/${filteredBlogs[0].slug}`} className='car-card group mb-12 block'>
									<div className='grid grid-cols-1 md:grid-cols-2'>
										{filteredBlogs[0].featuredImage && (
											<div className='h-72 md:h-80 overflow-hidden'>
												<img src={filteredBlogs[0].featuredImage} alt=''
													className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500' />
											</div>
										)}
										<div className='p-8 md:p-10 flex flex-col justify-center'>
											<span className='inline-block mb-3 px-3 py-1 text-xs font-bold rounded-full w-fit' style={{ background: 'rgba(255,138,61,0.15)', color: '#FF8A3D' }}>FEATURED</span>
											<h2 className='text-2xl md:text-3xl font-display font-extrabold mb-3 leading-tight' style={{ color: '#1A1A1A' }}>
												{filteredBlogs[0].title}
											</h2>
											<p className='mb-6 line-clamp-3 text-sm leading-relaxed' style={{ color: '#6B7280' }}>
												{filteredBlogs[0].excerpt}
											</p>
											<div className='flex items-center gap-5 text-xs' style={{ color: '#6B7280' }}>
												<span className='flex items-center gap-1'><User size={12} />{filteredBlogs[0].author || 'Miras Team'}</span>
												<span className='flex items-center gap-1'><Calendar size={12} />{formatDistanceToNow(new Date(filteredBlogs[0].createdAt), { addSuffix: true })}</span>
												<span className='flex items-center gap-1'><Eye size={12} />{filteredBlogs[0].views || 0} views</span>
											</div>
										</div>
									</div>
								</Link>
							)}

							{/* Grid */}
							<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
								{filteredBlogs.slice(1).map((blog) => (
									<Link key={blog._id} to={`/blog/${blog.slug}`} className='blog-card group flex flex-col'>
										{blog.featuredImage && (
											<div className='h-44 overflow-hidden'>
												<img src={blog.featuredImage} alt=''
													className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500' />
											</div>
										)}
										<div className='p-5 flex-1 flex flex-col'>
											<span className='tag mb-2'>{blog.category || 'Travel'}</span>
											<h3 className='text-base font-bold mb-2 line-clamp-2 flex-grow' style={{ color: '#1A1A1A' }}>{blog.title}</h3>
											<p className='text-xs line-clamp-2 mb-4' style={{ color: '#6B7280' }}>{blog.excerpt}</p>
											<div className='flex items-center justify-between text-xs pt-3' style={{ borderTop: '1px solid rgba(0,0,0,0.05)', color: '#6B7280' }}>
												<span className='flex items-center gap-1'><Calendar size={11} />{formatDistanceToNow(new Date(blog.createdAt), { addSuffix: true })}</span>
												<span className='font-semibold' style={{ color: '#FF8A3D' }}>Read →</span>
											</div>
										</div>
									</Link>
								))}
							</div>
						</>
					) : (
						<div className='text-center py-20' style={{ color: '#6B7280' }}>
							<div className='text-5xl mb-4'>📝</div>
							<p className='text-lg font-semibold'>No articles found</p>
							<p className='text-sm mt-1'>Try a different category or search term</p>
						</div>
					)}
				</div>
			</section>
		</div>
	);
}
