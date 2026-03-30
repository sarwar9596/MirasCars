import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { carsAPI } from '../utils/api';
import {
	ArrowLeft,
	Upload,
	X,
	Plus,
	AlertCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';

const CATEGORIES = [
	'SUV',
	'Sedan',
	'Hatchback',
	'Motorbike',
	'Luxury',
	'MUV',
];
const TRANSMISSIONS = ['Manual', 'Automatic'];
const FUEL_TYPES = ['Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid'];
const STATUSES = ['available', 'booked', 'maintenance'];

const INITIAL = {
	name: '',
	category: 'SUV',
	transmission: 'Manual',
	fuelType: 'Petrol',
	pricePerDay: '',
	pricePerWeek: '',
	pricePerMonth: '',
	seats: '',
	mileage: '',
	modelYear: '',
	lastServiceDate: '',
	bookedUntil: '',
	status: 'available',
	description: '',
	images: ['', '', '', '', '', ''],
	features: [],
	color: '',
	isFeatured: false,
	order: 0,
};

export default function AddEditCar() {
	const { id } = useParams();
	const navigate = useNavigate();
	const isEdit = !!id;
	const [form, setForm] = useState(INITIAL);
	const [loading, setLoading] = useState(false);
	const [fetching, setFetching] = useState(isEdit);
	const [errors, setErrors] = useState({});
	const [newFeature, setNewFeature] = useState('');

	useEffect(() => {
		if (!isEdit) return;
		carsAPI
			.getById(id)
			.then((res) => {
				const d = res.data?.car || res.data;
				const imgs = Array.isArray(d.images)
					? [...d.images]
					: [d.image || '', '', '', '', '', ''];
				while (imgs.length < 6) imgs.push('');
				// Map backend isAvailable boolean to form status field
				const status = d.isAvailable === false ? 'booked' : 'available'
				setForm({
					...INITIAL,
					...d,
					status,
					images: imgs.slice(0, 6),
					lastServiceDate: d.lastServiceDate
						? d.lastServiceDate.slice(0, 10)
						: '',
					bookedUntil: d.bookedUntil
						? d.bookedUntil.slice(0, 10)
						: '',
				});
			})
			.catch(() => toast.error('Failed to load car'))
			.finally(() => setFetching(false));
	}, [id]);

	const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));
	const setImg = (i, val) =>
		setForm((f) => {
			const imgs = [...f.images];
			imgs[i] = val;
			return { ...f, images: imgs };
		});

	const validate = () => {
		const e = {};
		if (!form.name.trim()) e.name = 'Car name is required';
		if (!form.pricePerDay || isNaN(form.pricePerDay))
			e.pricePerDay = 'Valid price required';
		if (!form.seats || isNaN(form.seats))
			e.seats = 'Number of seats required';
		if (!form.modelYear || isNaN(form.modelYear))
			e.modelYear = 'Model year required';
		return e;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const e2 = validate();
		if (Object.keys(e2).length) {
			setErrors(e2);
			return;
		}
		setLoading(true);
		try {
			const payload = {
				...form,
				images: form.images.filter(Boolean),
				pricePerDay: Number(form.pricePerDay),
				pricePerWeek: form.pricePerWeek
					? Number(form.pricePerWeek)
					: undefined,
				pricePerMonth: form.pricePerMonth
					? Number(form.pricePerMonth)
					: undefined,
				seats: Number(form.seats),
				mileage: form.mileage || undefined,
				modelYear: Number(form.modelYear),
				order: Number(form.order) || 0,
				isFeatured: Boolean(form.isFeatured),
				lastServiceDate: form.lastServiceDate || undefined,
				bookedUntil: form.bookedUntil || undefined,
			};
			if (isEdit) {
				await carsAPI.update(id, payload);
				toast.success('Car updated!');
			} else {
				await carsAPI.create(payload);
				toast.success('Car added to fleet!');
			}
			navigate('/cars');
		} catch (err) {
			toast.error(err.response?.data?.message || 'Save failed');
		} finally {
			setLoading(false);
		}
	};

	const addFeature = () => {
		if (!newFeature.trim()) return;
		set('features', [...(form.features || []), newFeature.trim()]);
		setNewFeature('');
	};
	const removeFeature = (i) =>
		set(
			'features',
			form.features.filter((_, idx) => idx !== i),
		);

	if (fetching)
		return (
			<div className='flex justify-center py-20'>
				<div className='w-8 h-8 border-2 border-brand-gold/30 border-t-brand-gold rounded-full animate-spin' />
			</div>
		);

	return (
		<div className='max-w-4xl mx-auto page-enter'>
			<button
				onClick={() => navigate('/cars')}
				className='flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors text-sm'>
				<ArrowLeft size={16} /> Back to Fleet
			</button>

			<form onSubmit={handleSubmit} className='space-y-6'>
				{/* Basic Info */}
				<div className='card p-6'>
					<h2 className='font-display font-bold text-white text-lg mb-5'>
						Basic Information
					</h2>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
						<div className='md:col-span-2'>
							<label className='label'>Car Name / Model *</label>
							<input
								value={form.name}
								onChange={(e) => set('name', e.target.value)}
								placeholder='e.g. Mahindra Thar 2024'
								className='input'
							/>
							{errors.name && (
								<p className='text-red-400 text-xs mt-1'>
									{errors.name}
								</p>
							)}
						</div>
						<div>
							<label className='label'>Category *</label>
							<select
								value={form.category}
								onChange={(e) => set('category', e.target.value)}
								className='input'>
								{CATEGORIES.map((c) => (
									<option key={c}>{c}</option>
								))}
							</select>
						</div>
						<div>
							<label className='label'>Color</label>
							<input
								value={form.color}
								onChange={(e) => set('color', e.target.value)}
								placeholder='e.g. Pearl White'
								className='input'
							/>
						</div>
						<div>
							<label className='label'>Transmission *</label>
							<select
								value={form.transmission}
								onChange={(e) => set('transmission', e.target.value)}
								className='input'>
								{TRANSMISSIONS.map((t) => (
									<option key={t}>{t}</option>
								))}
							</select>
						</div>
						<div>
							<label className='label'>Fuel Type</label>
							<select
								value={form.fuelType}
								onChange={(e) => set('fuelType', e.target.value)}
								className='input'>
								{FUEL_TYPES.map((f) => (
									<option key={f}>{f}</option>
								))}
							</select>
						</div>
						<div className='md:col-span-2'>
							<label className='label'>Description</label>
							<textarea
								value={form.description}
								onChange={(e) => set('description', e.target.value)}
								placeholder='Describe this car — terrain suitability, special features, etc.'
								rows={3}
								className='input resize-none'
							/>
						</div>
					</div>
				</div>

				{/* Specs */}
				<div className='card p-6'>
					<h2 className='font-display font-bold text-white text-lg mb-5'>
						Specifications & Pricing
					</h2>
					<div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
						<div>
							<label className='label'>Price / Day (₹) *</label>
							<input
								type='number'
								value={form.pricePerDay}
								onChange={(e) => set('pricePerDay', e.target.value)}
								placeholder='2500'
								className='input'
							/>
							{errors.pricePerDay && (
								<p className='text-red-400 text-xs mt-1'>
									{errors.pricePerDay}
								</p>
							)}
						</div>
						<div>
							<label className='label'>Price / Week (₹)</label>
							<input
								type='number'
								value={form.pricePerWeek}
								onChange={(e) => set('pricePerWeek', e.target.value)}
								placeholder='14000'
								className='input'
							/>
						</div>
						<div>
							<label className='label'>Price / Month (₹)</label>
							<input
								type='number'
								value={form.pricePerMonth}
								onChange={(e) => set('pricePerMonth', e.target.value)}
								placeholder='45000'
								className='input'
							/>
						</div>
						<div>
							<label className='label'>Seats *</label>
							<select
								value={form.seats}
								onChange={(e) => set('seats', e.target.value)}
								className='input'>
								<option value=''>Select Seats</option>
								{[4, 5, 6, 7].map((s) => (
									<option key={s}>{s}</option>
								))}
							</select>
							{errors.seats && (
								<p className='text-red-400 text-xs mt-1'>
									{errors.seats}
								</p>
							)}
						</div>
						<div>
							<label className='label'>Model Year *</label>
							<input
								type='number'
								value={form.modelYear}
								onChange={(e) => set('modelYear', e.target.value)}
								placeholder='2023'
								className='input'
							/>
							{errors.modelYear && (
								<p className='text-red-400 text-xs mt-1'>
									{errors.modelYear}
								</p>
							)}
						</div>
						<div>
							<label className='label'>Mileage</label>
							<input
								value={form.mileage}
								onChange={(e) => set('mileage', e.target.value)}
								placeholder='e.g. 18 kmpl'
								className='input'
							/>
						</div>
						<div>
							<label className='label'>Last Service Date</label>
							<input
								type='date'
								value={form.lastServiceDate}
								onChange={(e) =>
									set('lastServiceDate', e.target.value)
								}
								className='input'
							/>
						</div>
						<div>
							<label className='label'>Status</label>
							<select
								value={form.status}
								onChange={(e) => set('status', e.target.value)}
								className='input'>
								{STATUSES.map((s) => (
									<option key={s} value={s}>
										{s.charAt(0).toUpperCase() + s.slice(1)}
									</option>
								))}
							</select>
						</div>
					</div>

					{/* Booked until */}
					<div className='mt-4 p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-xl'>
						<label className='label text-yellow-600'>
							Booked Until (if currently reserved)
						</label>
						<input
							type='date'
							value={form.bookedUntil}
							onChange={(e) => set('bookedUntil', e.target.value)}
							className='input max-w-xs'
						/>
						<p className='text-xs text-gray-600 mt-1'>
							Leave empty if car is available now
						</p>
					</div>
				</div>

				{/* Photos */}
				<div className='card p-6'>
					<h2 className='font-display font-bold text-white text-lg mb-2'>
						Car Photos
					</h2>
					<p className='text-gray-500 text-sm mb-5'>
						Add up to 6 image URLs (Cloudinary, Unsplash, or direct
						links)
					</p>
					<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
						{form.images.map((img, i) => (
							<div key={i}>
								<label className='label'>
									Photo {i + 1}
									{i === 0 ? ' (Main)' : ''}
								</label>
								<div className='relative'>
									<input
										value={img}
										onChange={(e) => setImg(i, e.target.value)}
										placeholder='https://res.cloudinary.com/...'
										className='input pr-10'
									/>
									{img && (
										<button
											type='button'
											onClick={() => setImg(i, '')}
											className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-red-400'>
											<X size={14} />
										</button>
									)}
								</div>
								{img && (
									<div className='mt-2 h-28 rounded-lg overflow-hidden bg-dark-700'>
										<img
											src={img}
											alt=''
											className='w-full h-full object-cover'
											onError={(e) => {
												e.target.style.display = 'none';
											}}
										/>
									</div>
								)}
							</div>
						))}
					</div>
				</div>

				{/* Featured & Visibility */}
				<div className='card p-6'>
					<h2 className='font-display font-bold text-white text-lg mb-5'>
						Display Settings
					</h2>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
						<div>
							<div className='flex items-center justify-between mb-2'>
								<label className='label mb-0'>
									Featured on Homepage
								</label>
								<button
									type='button'
									onClick={() => set('isFeatured', !form.isFeatured)}
									className={`w-12 h-6 rounded-full transition-all ${form.isFeatured ? 'bg-brand-gold' : 'bg-dark-500'} relative`}>
									<div
										className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all ${form.isFeatured ? 'left-6' : 'left-0.5'}`}
									/>
								</button>
							</div>
							<p className='text-xs text-gray-500'>
								Show this car prominently on the homepage
							</p>
						</div>
						<div>
							<label className='label'>
								Display Order / Priority
							</label>
							<input
								type='number'
								value={form.order}
								onChange={(e) => set('order', e.target.value)}
								placeholder='0'
								className='input'
							/>
							<p className='text-xs text-gray-500 mt-1'>
								Lower numbers appear first (0, 1, 2…)
							</p>
						</div>
					</div>
				</div>

				{/* Features */}
				<div className='card p-6'>
					<h2 className='font-display font-bold text-white text-lg mb-5'>
						Features & Amenities
					</h2>
					<div className='flex gap-2 mb-3'>
						<input
							value={newFeature}
							onChange={(e) => setNewFeature(e.target.value)}
							onKeyDown={(e) =>
								e.key === 'Enter' &&
								(e.preventDefault(), addFeature())
							}
							placeholder='e.g. AC, GPS, Bluetooth, 4WD…'
							className='input flex-1'
						/>
						<button
							type='button'
							onClick={addFeature}
							className='btn-outline px-4'>
							<Plus size={16} />
						</button>
					</div>
					{(form.features || []).length > 0 && (
						<div className='flex flex-wrap gap-2 mt-3'>
							{form.features.map((f, i) => (
								<span
									key={i}
									className='flex items-center gap-1.5 bg-dark-600 border border-dark-400 text-gray-300 text-sm px-3 py-1.5 rounded-full'>
									{f}
									<button
										type='button'
										onClick={() => removeFeature(i)}
										className='text-gray-500 hover:text-red-400 transition-colors'>
										<X size={12} />
									</button>
								</span>
							))}
						</div>
					)}
				</div>

				{/* Submit */}
				<div className='flex items-center gap-3 pb-6'>
					<button
						type='button'
						onClick={() => navigate('/cars')}
						className='btn-outline px-8 py-3'>
						Cancel
					</button>
					<button
						type='submit'
						disabled={loading}
						className='btn-gold px-8 py-3 flex items-center gap-2'>
						{loading ? (
							<>
								<div className='w-4 h-4 border-2 border-dark-900/30 border-t-dark-900 rounded-full animate-spin' />
								<span>Saving…</span>
							</>
						) : (
							`${isEdit ? 'Update' : 'Add'} Car`
						)}
					</button>
				</div>
			</form>
		</div>
	);
}
