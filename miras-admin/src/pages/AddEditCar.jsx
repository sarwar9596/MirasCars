import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { carsAPI } from '../utils/api';
import {
	ArrowLeft,
	Upload,
	X,
	Plus,
	AlertCircle,
	Image,
} from 'lucide-react';
import toast from 'react-hot-toast';

const api = axios.create({
	baseURL: 'http://localhost:5000/api',
	timeout: 30000,
});
api.interceptors.request.use(config => {
	const token = localStorage.getItem('miras_token');
	if (token) config.headers.Authorization = `Bearer ${token}`;
	return config;
});

async function uploadImage(file) {
	const formData = new FormData();
	formData.append('image', file);
	const res = await api.post('/upload/local', formData, {
		headers: { 'Content-Type': 'multipart/form-data' },
	});
	return res.data.url;
}

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
				const d = res.data?.data || res.data;
				const imgs = Array.isArray(d.images)
					? [...d.images]
					: [d.image || '', '', '', '', '', ''];
				while (imgs.length < 6) imgs.push('');
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
				color: form.color || undefined,
				features: form.features?.length ? form.features : undefined,
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
				<div className='w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin' />
			</div>
		);

	return (
		<div className='max-w-4xl mx-auto page-enter'>
			<button
				onClick={() => navigate('/cars')}
				className='flex items-center gap-2 text-gray-400 hover:text-gray-600 mb-6 transition-colors text-sm'>
				<ArrowLeft size={16} /> Back to Fleet
			</button>

			<form onSubmit={handleSubmit} className='space-y-6'>
				{/* Basic Info */}
				<div className='card p-6'>
					<h2 className='font-bold text-gray-800 text-lg mb-5'>
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
								<p className='text-red-500 text-xs mt-1'>
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
					<h2 className='font-bold text-gray-800 text-lg mb-5'>
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
								<p className='text-red-500 text-xs mt-1'>
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
								<p className='text-red-500 text-xs mt-1'>
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
								<p className='text-red-500 text-xs mt-1'>
									{errors.modelYear}
								</p>
							)}
						</div>
						<div>
							<label className='label'>Mileage</label>
							<input
								value={form.mileage}
								onChange={(e) => set('mileage', e.target.value)}
								placeholder='e.g. 18'
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
					<div className='mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl'>
						<label className='label text-amber-600'>
							Booked Until (if currently reserved)
						</label>
						<input
							type='date'
							value={form.bookedUntil}
							onChange={(e) => set('bookedUntil', e.target.value)}
							className='input max-w-xs'
						/>
						<p className='text-xs text-gray-400 mt-1'>
							Leave empty if car is available now
						</p>
					</div>
				</div>

				{/* Photos */}
				<div className='card p-6'>
					<h2 className='font-bold text-gray-800 text-lg mb-2'>
						Car Photos
					</h2>
					<p className='text-gray-400 text-sm mb-5'>
						Upload images from your device — up to 6 photos
					</p>
					<div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
						{form.images.map((img, i) => (
							<ImageSlot
								key={i}
								img={img}
								label={i === 0 ? 'Main Photo' : `Photo ${i + 1}`}
								onUpload={(url) => setImg(i, url)}
								onRemove={() => setImg(i, '')}
								isFirst={i === 0}
							/>
						))}
					</div>
				</div>

				{/* Featured & Visibility */}
				<div className='card p-6'>
					<h2 className='font-bold text-gray-800 text-lg mb-5'>
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
									className={`w-12 h-6 rounded-full transition-all ${form.isFeatured ? 'bg-primary' : 'bg-gray-300'} relative`}>
									<div
										className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all ${form.isFeatured ? 'left-6' : 'left-0.5'}`}
									/>
								</button>
							</div>
							<p className='text-xs text-gray-400'>
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
							<p className='text-xs text-gray-400 mt-1'>
								Lower numbers appear first (0, 1, 2…)
							</p>
						</div>
					</div>
				</div>

				{/* Features */}
				<div className='card p-6'>
					<h2 className='font-bold text-gray-800 text-lg mb-5'>
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
									className='flex items-center gap-1.5 bg-gray-100 border border-gray-200 text-gray-600 text-sm px-3 py-1.5 rounded-full'>
									{f}
									<button
										type='button'
										onClick={() => removeFeature(i)}
										className='text-gray-400 hover:text-red-500 transition-colors'>
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
						className='btn-primary px-8 py-3 flex items-center gap-2'>
						{loading ? (
							<>
								<div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin' />
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

function ImageSlot({ img, label, onUpload, onRemove, isFirst }) {
	const [uploading, setUploading] = useState(false);
	const inputRef = useRef(null);

	const handleFile = async (e) => {
		const file = e.target.files?.[0];
		if (!file) return;
		setUploading(true);
		try {
			const url = await uploadImage(file);
			onUpload(url);
		} catch {
			toast.error('Upload failed — try a smaller image');
		} finally {
			setUploading(false);
			e.target.value = '';
		}
	};

	return (
		<div>
			<label className='label'>
				{label}
				{isFirst ? ' *' : ''}
			</label>
			<div className='relative'>
				<input
					ref={inputRef}
					type='file'
					accept='image/jpeg,image/png,image/webp,image/gif'
					onChange={handleFile}
					className='hidden'
				/>
				{uploading ? (
					<div className='input h-28 flex items-center justify-center gap-2 text-primary'>
						<div className='w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin' />
						<span className='text-sm'>Uploading…</span>
					</div>
				) : img ? (
					<div className='relative h-28 rounded-xl overflow-hidden bg-gray-100'>
						<img src={img} alt={label} className='w-full h-full object-cover' />
						<div className='absolute inset-0 bg-black/0 hover:bg-black/30 transition-colors flex items-center justify-center'>
							<div className='flex gap-2 opacity-0 hover:opacity-100 transition-opacity'>
								<button
									type='button'
									onClick={() => inputRef.current?.click()}
									className='w-8 h-8 rounded-lg bg-white/90 border border-gray-200 flex items-center justify-center text-gray-500 hover:text-primary transition-colors'
									title='Replace image'>
									<Upload size={13} />
								</button>
								<button
									type='button'
									onClick={onRemove}
									className='w-8 h-8 rounded-lg bg-white/90 border border-gray-200 flex items-center justify-center text-gray-500 hover:text-red-500 transition-colors'
									title='Remove image'>
									<X size={13} />
								</button>
							</div>
						</div>
					</div>
				) : (
					<button
						type='button'
						onClick={() => inputRef.current?.click()}
						className='input h-28 flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-primary hover:border-primary/30 cursor-pointer transition-colors'>
						<Image size={20} />
						<span className='text-xs'>Click to upload</span>
					</button>
				)}
			</div>
		</div>
	);
}
