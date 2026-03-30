import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { blogsAPI } from '../utils/api';
import { Eye, Calendar, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

export default function Blogs() {
	const [blogs, setBlogs] = useState([]);
	const [loading, setLoading] = useState(true);
	const [selectedCategory, setSelectedCategory] = useState('All');
	const [searchTerm, setSearchTerm] = useState('');

	const categories = [
		'All',
		'Travel',
		'Kashmir Guide',
		'Car Tips',
		'Season Guide',
		'News',
		'Adventure',
	];

	useEffect(() => {
		const fetchBlogs = async () => {
			try {
				const res = await blogsAPI.getAll({ limit: 50 });
				setBlogs(res.data?.data || []);
			} catch (err) {
				console.error('Error fetching blogs:', err);
				toast.error('Failed to load blog posts');
			} finally {
				setLoading(false);
			}
		};
		fetchBlogs();
	}, []);

	const filteredBlogs = blogs.filter((blog) => {
		const matchCategory =
			selectedCategory === 'All' ||
			blog.category === selectedCategory;
		const matchSearch =
			blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
			(blog.excerpt || '')
				.toLowerCase()
				.includes(searchTerm.toLowerCase());
		return matchCategory && matchSearch;
	});

	return (
		<div>
			{/* Header */}
			<section className='bg-gradient-to-br from-dark-800 to-dark-900 py-16'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					<h1 className='heading-2 mb-4'>Travel Guides & Articles</h1>
					<p className='text-gray-400 text-lg'>
						Discover tips, stories, and insights from Kashmir
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
							placeholder='Search blog posts...'
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className='input'
						/>

						{/* Category Filter */}
						<div className='flex flex-wrap gap-2'>
							{categories.map((cat) => (
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

			{/* Blogs Grid */}
			<section className='py-20 bg-dark-900'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					{loading ? (
						<div className='flex justify-center py-20'>
							<div className='w-12 h-12 border-3 border-brand-gold/30 border-t-brand-gold rounded-full animate-spin'></div>
						</div>
					) : filteredBlogs.length > 0 ? (
						<>
							{/* Featured Post */}
							{filteredBlogs[0] && (
								<Link
									to={`/blog/${filteredBlogs[0].slug}`}
									className='card card-hover overflow-hidden mb-12 group'>
									<div className='grid grid-cols-1 md:grid-cols-2'>
										{filteredBlogs[0].featuredImage && (
											<div className='h-80 bg-dark-700 overflow-hidden'>
												<img
													src={filteredBlogs[0].featuredImage}
													alt=''
													className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
												/>
											</div>
										)}
										<div className='p-8 md:p-10 flex flex-col justify-center'>
											<span className='inline-block mb-3 px-3 py-1 bg-brand-gold/10 text-brand-gold text-xs font-bold rounded-full w-fit'>
												FEATURED
											</span>
											<h2 className='text-3xl font-bold text-white mb-4'>
												{filteredBlogs[0].title}
											</h2>
											<p className='text-gray-400 mb-6 line-clamp-3'>
												{filteredBlogs[0].excerpt}
											</p>
											<div className='flex items-center gap-6 text-sm text-gray-500'>
												<div className='flex items-center gap-2'>
													<User size={16} />
													<span>
														{filteredBlogs[0].author || 'Miras Team'}
													</span>
												</div>
												<div className='flex items-center gap-2'>
													<Eye size={16} />
													<span>
														{filteredBlogs[0].views || 0} views
													</span>
												</div>
											</div>
										</div>
									</div>
								</Link>
							)}

							{/* Blog Grid */}
							<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
								{filteredBlogs.slice(1).map((blog) => (
									<Link
										key={blog._id}
										to={`/blog/${blog.slug}`}
										className='card card-hover group overflow-hidden flex flex-col'>
										{blog.featuredImage && (
											<div className='h-48 bg-dark-700 overflow-hidden'>
												<img
													src={blog.featuredImage}
													alt=''
													className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
												/>
											</div>
										)}
										<div className='p-6 flex-1 flex flex-col'>
											<span className='inline-block mb-3 px-2.5 py-1 bg-brand-gold/10 text-brand-gold text-xs font-medium rounded-full w-fit'>
												{blog.category}
											</span>
											<h3 className='text-lg font-bold text-white mb-2 line-clamp-2 flex-grow'>
												{blog.title}
											</h3>
											<p className='text-gray-400 text-sm line-clamp-2 mb-4'>
												{blog.excerpt}
											</p>

											<div className='flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-dark-400/30'>
												<div className='flex items-center gap-2'>
													<Calendar size={12} />
													<span>
														{formatDistanceToNow(
															new Date(blog.createdAt),
															{ addSuffix: true },
														)}
													</span>
												</div>
												<div className='flex items-center gap-1'>
													<Eye size={12} />
													<span>{blog.views || 0}</span>
												</div>
											</div>
										</div>
									</Link>
								))}
							</div>
						</>
					) : (
						<div className='text-center py-20 text-gray-400'>
							<p>No blog posts found</p>
						</div>
					)}
				</div>
			</section>
		</div>
	);
}
