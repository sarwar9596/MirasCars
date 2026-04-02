import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { carsAPI, inquiriesAPI } from '../utils/api';
import { ArrowLeft, Users, Zap, Fuel, Gauge, Heart, Share2, MapPin, CheckCircle, Shield, Headphones, Calendar, Wrench, Palette, Star, BookOpen, X, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import { useSettings } from '../context/SettingsContext';

export default function CarDetail() {
	const { slug } = useParams();
	const navigate = useNavigate();
	const { whatsapp } = useSettings();
	const [car, setCar] = useState(null);
	const [loading, setLoading] = useState(true);
	const [mainImage, setMainImage] = useState('');
	const [liked, setLiked] = useState(false);
	const [bookingOpen, setBookingOpen] = useState(false);
	const [bookingLoading, setBookingLoading] = useState(false);
	const [successUrl, setSuccessUrl] = useState('');
	const [bookingForm, setBookingForm] = useState({
		name: '', phone: '', email: '',
		pickupDate: '', dropoffDate: '',
		licenceFile: null,
	});

	useEffect(() => {
		const fetchCar = async () => {
			try {
				const res = await carsAPI.getById(slug);
				const carData = res.data?.data || res.data;
				setCar(carData);
				setMainImage(carData.images?.[0] || '');
			} catch {
				toast.error('Car not found');
				navigate('/cars');
			} finally {
				setLoading(false);
			}
		};
		fetchCar();
	}, [slug, navigate]);

	const handleBookingChange = (e) => {
		const { name, value, files } = e.target;
		if (name === 'licenceFile') {
			setBookingForm(prev => ({ ...prev, licenceFile: files[0] || null }));
		} else {
			setBookingForm(prev => ({ ...prev, [name]: value }));
		}
	};

	const handleBookingSubmit = async (e) => {
		e.preventDefault();
		if (!bookingForm.name || !bookingForm.phone || !bookingForm.pickupDate || !bookingForm.dropoffDate) {
			toast.error('Please fill in your name, phone, and both dates');
			return;
		}
		setBookingLoading(true);
		try {
			const payload = {
				name: bookingForm.name,
				phone: bookingForm.phone,
				email: bookingForm.email,
				carName: car.name,
				carId: car._id,
				pickupDate: bookingForm.pickupDate,
				dropoffDate: bookingForm.dropoffDate,
				source: 'booking',
				message: bookingForm.licenceFile
					? `Licence uploaded: ${bookingForm.licenceFile.name}`
					: 'No licence photo attached',
			};
			const res = await inquiriesAPI.create(payload);
			const waUrl = res.data?.whatsappUrl;
			setSuccessUrl(waUrl || `https://wa.me/${whatsapp}`);
			setBookingOpen(false);
			toast.success('Booking request sent! We will contact you shortly.');
		} catch {
			toast.error('Failed to submit booking. Please try again.');
		} finally {
			setBookingLoading(false);
		}
	};

	const openBooking = () => {
		setBookingForm({ name: '', phone: '', email: '', pickupDate: '', dropoffDate: '', licenceFile: null });
		setSuccessUrl('');
		setBookingOpen(true);
	};

	if (loading) {
		return (
			<div className='min-h-screen flex items-center justify-center' style={{ background: '#F8F9FA' }}>
				<div className='w-12 h-12 border-4 rounded-full animate-spin' style={{ borderColor: 'rgba(47,164,169,0.2)', borderTopColor: '#003366' }} />
			</div>
		);
	}

	if (!car) return null;

	const allPrices = [
		{ label: 'Per Day', value: car.pricePerDay, symbol: 'day' },
		...(car.pricePerWeek ? [{ label: 'Per Week', value: car.pricePerWeek, symbol: 'week' }] : []),
		...(car.pricePerMonth ? [{ label: 'Per Month', value: car.pricePerMonth, symbol: 'month' }] : []),
	];

	return (
		<div style={{ background: '#F8F9FA' }}>
			{/* Nav Bar */}
			<div className='py-3' style={{ background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between'>
					<button onClick={() => navigate('/cars')}
						className='flex items-center gap-2 text-sm font-medium transition-colors'
						style={{ color: '#6B7280' }}>
						<ArrowLeft size={18} /> Back to Fleet
					</button>
					<div className='flex items-center gap-2'>
						<button onClick={() => setLiked(!liked)}
							className='p-2 rounded-xl transition-all'
							style={{ background: liked ? 'rgba(239,68,68,0.1)' : 'rgba(0,0,0,0.05)', color: liked ? '#EF4444' : '#6B7280' }}>
							<Heart size={18} fill={liked ? 'currentColor' : 'none'} />
						</button>
						<button onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success('Link copied!'); }}
							className='p-2 rounded-xl transition-all' style={{ background: 'rgba(0,0,0,0.05)', color: '#6B7280' }}>
							<Share2 size={18} />
						</button>
					</div>
				</div>
			</div>

			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10'>
				<div className='grid grid-cols-1 lg:grid-cols-3 gap-10'>

					{/* Left Column */}
					<div className='lg:col-span-2'>
						{/* Hero Image */}
						<div className='rounded-3xl overflow-hidden bg-gray-200 h-72 md:h-[460px] mb-4 shadow-lg'>
							{mainImage ? (
								<img src={mainImage} alt={car.name} className='w-full h-full object-cover' />
							) : (
								<div className='w-full h-full flex items-center justify-center text-6xl'>🚗</div>
							)}
						</div>

						{/* Thumbnail Gallery */}
						{car.images && car.images.length > 1 && (
							<div className='grid grid-cols-4 gap-3 mb-10'>
								{car.images.map((img, i) => (
									<button key={i} onClick={() => setMainImage(img)}
										className='h-20 rounded-xl overflow-hidden border-2 transition-all'
										style={{ borderColor: mainImage === img ? '#003366' : 'transparent', boxShadow: mainImage === img ? '0 0 0 2px rgba(47,164,169,0.3)' : 'none' }}>
										<img src={img} alt='' className='w-full h-full object-cover' />
									</button>
								))}
							</div>
						)}

						{/* Specifications */}
						<div className='card-glass p-8 mb-5'>
							<h2 className='text-lg font-bold mb-6' style={{ color: '#1A1A1A' }}>Specifications</h2>
							<div className='grid grid-cols-2 md:grid-cols-4 gap-5'>
								{[
									{ icon: Users, label: 'Seats', val: car.seats ? `${car.seats} Seats` : '—' },
									{ icon: Fuel, label: 'Fuel Type', val: car.fuelType ?? '—' },
									{ icon: Zap, label: 'Transmission', val: car.transmission ?? '—' },
									{ icon: Gauge, label: 'Model Year', val: car.modelYear ?? '—' },
									{ icon: Palette, label: 'Color', val: car.color ?? '—' },
									{ icon: Wrench, label: 'Mileage', val: car.mileage ? `${car.mileage} kmpl` : '—' },
									{ icon: Calendar, label: 'Last Service', val: car.lastServiceDate ? new Date(car.lastServiceDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—' },
									{ icon: BookOpen, label: 'Total Trips', val: car.totalBookings ? `${car.totalBookings} trips` : '—' },
									...(car.isFeatured ? [{ icon: Star, label: 'Rating', val: 'Featured' }] : []),
								].map(({ icon: Icon, label, val }) => (
									<div key={label}>
										<div className='flex items-center gap-2 mb-2'>
											<Icon size={16} style={{ color: '#003366' }} />
											<span className='text-sm' style={{ color: '#6B7280' }}>{label}</span>
										</div>
										<p className='text-base font-bold' style={{ color: '#1A1A1A' }}>{val}</p>
									</div>
								))}
							</div>
						</div>

						{/* Features */}
						{car.features && car.features.length > 0 && (
							<div className='card-glass p-8 mb-5'>
								<h2 className='text-lg font-bold mb-5' style={{ color: '#1A1A1A' }}>Features & Amenities</h2>
								<div className='grid grid-cols-2 md:grid-cols-3 gap-3'>
									{car.features.map((feature, i) => (
										<div key={i} className='flex items-center gap-2.5 p-3 rounded-xl text-sm' style={{ background: 'rgba(47,164,169,0.06)' }}>
											<CheckCircle size={15} style={{ color: '#003366' }} />
											<span style={{ color: '#1A1A1A' }}>{feature}</span>
										</div>
									))}
								</div>
							</div>
						)}

						{/* Description */}
						{car.description != null && car.description !== '' && (
							<div className='card-glass p-8 mb-5'>
								<h2 className='text-lg font-bold mb-4' style={{ color: '#1A1A1A' }}>About This Vehicle</h2>
								<p className='leading-relaxed text-base' style={{ color: '#6B7280' }}>{car.description}</p>
							</div>
						)}

						{/* Seasonal Note */}
						{car.seasonalNote != null && car.seasonalNote !== '' && (
							<div className='card-glass p-6' style={{ background: 'rgba(255,138,61,0.06)', borderColor: 'rgba(255,138,61,0.2)' }}>
								<div className='flex items-start gap-3'>
									<span className='text-xl mt-0.5'>ℹ️</span>
									<div>
										<p className='text-sm font-bold mb-1' style={{ color: '#C5A059' }}>Seasonal Note</p>
										<p className='text-sm' style={{ color: '#6B7280' }}>{car.seasonalNote}</p>
									</div>
								</div>
							</div>
						)}
					</div>

					{/* Right Column: Booking Card */}
					<div>
						<div className='card-glass p-7 space-y-5' style={{ position: 'sticky', top: '90px' }}>
							{/* Title */}
							<div>
								<span className='tag-gold mb-2 inline-block'>{car.category}</span>
								<h1 className='text-2xl md:text-3xl font-display font-extrabold leading-tight mb-1' style={{ color: '#1A1A1A' }}>{car.name}</h1>
								{car.color != null && car.color !== '' && (
									<p className='text-sm flex items-center gap-1' style={{ color: '#6B7280' }}>
										<Palette size={13} style={{ color: '#003366' }} />{car.color}
									</p>
								)}
							</div>

							{/* Availability */}
							<div className='flex items-center gap-2 p-3 rounded-xl' style={{ background: car.isAvailable === false ? 'rgba(239,68,68,0.08)' : 'rgba(34,197,94,0.08)', border: `1px solid ${car.isAvailable === false ? 'rgba(239,68,68,0.2)' : 'rgba(34,197,94,0.2)'}` }}>
								<div className='w-2.5 h-2.5 rounded-full flex-shrink-0' style={{ background: car.isAvailable === false ? '#EF4444' : '#22C55E' }} />
								<p className='text-sm font-semibold' style={{ color: car.isAvailable === false ? '#EF4444' : '#22C55E' }}>
									{car.isAvailable === false ? 'Currently Booked' : 'Available Now'}
								</p>
								{car.bookedUntil && (
									<span className='text-xs ml-auto' style={{ color: '#6B7280' }}>Free from {new Date(car.bookedUntil).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
								)}
							</div>

							{/* Pricing */}
							<div className='border-t pt-5' style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
								<p className='text-sm font-medium mb-3' style={{ color: '#6B7280' }}>Pricing</p>
								<div className='space-y-2'>
									{allPrices.map((price, i) => (
										<div key={i} className='flex items-center justify-between'>
											<span className='text-sm' style={{ color: '#6B7280' }}>{price.label}</span>
											<div className='flex items-baseline gap-0.5'>
												<span className='text-xl font-extrabold' style={{ background: 'linear-gradient(135deg, #C5A059, #D4B06A)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>₹{price.value?.toLocaleString()}</span>
												<span className='text-xs' style={{ color: '#6B7280' }}>/{price.symbol}</span>
											</div>
										</div>
									))}
								</div>
							</div>

							{/* CTAs */}
							<div className='space-y-3 pt-4'>
								<button onClick={openBooking} className='block btn-blue w-full py-3 justify-center text-base font-bold'>
									Book This Car
								</button>
								<a href={`https://wa.me/${whatsapp}?text=Hi!%20I%27m%20interested%20in%20renting%20${encodeURIComponent(car.name)}`}
									target='_blank' rel='noopener noreferrer'
									className='block text-center py-3 font-semibold rounded-full transition-all'
									style={{ background: '#25D366', color: 'white' }}>
									💬 WhatsApp Us
								</a>
							</div>

							{/* Success Card */}
							{successUrl && (
								<div className='rounded-xl p-4 text-center' style={{ background: 'rgba(37,211,102,0.1)', border: '1px solid rgba(37,211,102,0.25)' }}>
									<p className='text-sm font-semibold mb-2' style={{ color: '#25D366' }}>Also message us on WhatsApp</p>
									<a href={successUrl} target='_blank' rel='noopener noreferrer'
										className='inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full'
										style={{ background: '#25D366', color: 'white' }}>
										💬 Open WhatsApp
									</a>
								</div>
							)}

							{/* Includes */}
							<div className='rounded-xl p-4' style={{ background: 'rgba(47,164,169,0.06)' }}>
								{[
									{ icon: MapPin, text: 'Delivery across Kashmir' },
									{ icon: Shield, text: 'Insurance Included' },
									{ icon: Headphones, text: '24/7 Roadside Support' },
									...(car.lastServiceDate ? [{ icon: Wrench, text: `Last serviced: ${new Date(car.lastServiceDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}` }] : []),
								].map(({ icon: Icon, text }) => (
									<div key={text} className='flex items-center gap-2.5 text-sm mb-2 last:mb-0'>
										<Icon size={14} style={{ color: '#003366' }} />
										<span style={{ color: '#6B7280' }}>{text}</span>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* ── Booking Modal ─────────────────────────────── */}
			{bookingOpen && (
				<div className='fixed inset-0 z-50 flex items-center justify-center p-4' style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
					<div className='w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl' style={{ background: 'white', maxHeight: '90vh', overflowY: 'auto' }}>
						{/* Modal Header */}
						<div className='px-6 py-5 flex items-center justify-between' style={{ background: 'linear-gradient(135deg, #003366, #004080)' }}>
							<div>
								<h2 className='text-white font-display font-bold text-lg'>Book Your Ride</h2>
								<p className='text-white/70 text-sm'>{car.name}</p>
							</div>
							<button onClick={() => setBookingOpen(false)} className='p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors'>
								<X size={20} />
							</button>
						</div>

						{/* Booking Form */}
						<form onSubmit={handleBookingSubmit} className='p-6 space-y-4'>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
								<div>
									<label className='block text-sm font-semibold mb-1.5' style={{ color: '#1A1A1A' }}>Full Name *</label>
									<input type='text' name='name' value={bookingForm.name} onChange={handleBookingChange}
										placeholder='Your full name' className='input-glass' required />
								</div>
								<div>
									<label className='block text-sm font-semibold mb-1.5' style={{ color: '#1A1A1A' }}>Phone *</label>
									<input type='tel' name='phone' value={bookingForm.phone} onChange={handleBookingChange}
										placeholder='+91 XXXXX XXXXX' className='input-glass' required />
								</div>
							</div>
							<div>
								<label className='block text-sm font-semibold mb-1.5' style={{ color: '#1A1A1A' }}>Email (Optional)</label>
								<input type='email' name='email' value={bookingForm.email} onChange={handleBookingChange}
									placeholder='your@email.com' className='input-glass' />
							</div>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
								<div>
									<label className='block text-sm font-semibold mb-1.5' style={{ color: '#1A1A1A' }}>Pickup Date *</label>
									<input type='date' name='pickupDate' value={bookingForm.pickupDate}
										onChange={handleBookingChange} className='input-glass' required />
								</div>
								<div>
									<label className='block text-sm font-semibold mb-1.5' style={{ color: '#1A1A1A' }}>Return Date *</label>
									<input type='date' name='dropoffDate' value={bookingForm.dropoffDate}
										onChange={handleBookingChange} className='input-glass' required />
								</div>
							</div>
							<div>
								<label className='block text-sm font-semibold mb-1.5' style={{ color: '#1A1A1A' }}>Driving Licence Photo (Optional)</label>
								<label className='flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all'
									style={{ border: '1.5px dashed rgba(0,51,102,0.3)', background: 'rgba(0,51,102,0.03)' }}>
									<Upload size={18} style={{ color: '#003366' }} />
									<span className='text-sm' style={{ color: bookingForm.licenceFile ? '#003366' : '#6B7280' }}>
										{bookingForm.licenceFile ? bookingForm.licenceFile.name : 'Click to upload or drag & drop'}
									</span>
									<input type='file' name='licenceFile' accept='image/*,.pdf' onChange={handleBookingChange}
										className='hidden' />
								</label>
							</div>

							{/* Car Summary */}
							<div className='rounded-xl p-4' style={{ background: 'rgba(0,51,102,0.04)' }}>
								<div className='flex items-center gap-3'>
									{car.images?.[0] && (
										<img src={car.images[0]} alt={car.name} className='w-14 h-14 rounded-lg object-cover' />
									)}
									<div>
										<p className='font-bold text-sm' style={{ color: '#1A1A1A' }}>{car.name}</p>
										<p className='text-xs' style={{ color: '#6B7280' }}>{car.color} · {car.category}</p>
										<p className='text-sm font-bold' style={{ color: '#C5A059' }}>₹{car.pricePerDay?.toLocaleString()}/day</p>
									</div>
								</div>
							</div>

							<button type='submit' disabled={bookingLoading}
								className='btn-blue w-full py-3.5 text-base justify-center'>
								{bookingLoading ? (
									<><div className='w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin' />Submitting…</>
								) : (
									<>Submit Booking Request</>
								)}
							</button>
							<p className='text-xs text-center' style={{ color: '#6B7280' }}>We'll contact you within 2 hours to confirm your booking</p>
						</form>
					</div>
				</div>
			)}
		</div>
	);
}
