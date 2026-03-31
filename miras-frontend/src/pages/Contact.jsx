import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { inquiriesAPI } from '../utils/api';
import { Mail, MapPin, Phone, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Contact() {
	const [searchParams] = useSearchParams();
	const [form, setForm] = useState({
		name: '',
		email: '',
		phone: '',
		carName: '',
		pickupDate: '',
		dropoffDate: '',
		message: '',
	});
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const car = searchParams.get('car');
		if (car) setForm(f => ({ ...f, carName: car }));
	}, [searchParams]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!form.name || !form.phone) {
			toast.error('Please fill in your name and phone number');
			return;
		}

		setLoading(true);
		try {
			await inquiriesAPI.create({
				...form,
				source: 'contact',
			});
			toast.success("Inquiry sent! We'll contact you soon.");
			setForm({
				name: '',
				email: '',
				phone: '',
				carName: searchParams.get('car') || '',
				pickupDate: '',
				dropoffDate: '',
				message: '',
			});
		} catch (err) {
			toast.error('Failed to send inquiry. Please try again.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='min-h-screen bg-dark-900'>
			{/* Header */}
			<section className='bg-gradient-to-br from-dark-800 to-dark-900 py-16'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					<h1 className='heading-2 mb-4'>Contact Us</h1>
					<p className='text-gray-400 text-lg'>
						Have questions? We're here to help 24/7
					</p>
				</div>
			</section>

			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20'>
				<div className='grid grid-cols-1 lg:grid-cols-3 gap-12'>
					{/* Contact Info */}
					<div className='space-y-8'>
						<h2 className='heading-3'>Get in Touch</h2>

						<div className='space-y-6'>
							<div className='flex gap-4'>
								<div className='flex-shrink-0'>
									<Phone className='text-brand-gold' size={24} />
								</div>
								<div>
									<h3 className='font-semibold text-white mb-1'>
										Phone
									</h3>
									<p className='text-gray-400'>+91 98765 43210</p>
								</div>
							</div>

							<div className='flex gap-4'>
								<div className='flex-shrink-0'>
									<MessageCircle
										className='text-brand-gold'
										size={24}
									/>
								</div>
								<div>
									<h3 className='font-semibold text-white mb-1'>
										WhatsApp
									</h3>
									<a
										href='https://wa.me/919876543210'
										target='_blank'
										rel='noopener noreferrer'
										className='text-brand-gold hover:text-brand-gold-light'>
										Start a conversation
									</a>
								</div>
							</div>

							<div className='flex gap-4'>
								<div className='flex-shrink-0'>
									<Mail className='text-brand-gold' size={24} />
								</div>
								<div>
									<h3 className='font-semibold text-white mb-1'>
										Email
									</h3>
									<a
										href='mailto:info@mirascarrental.com'
										className='text-gray-400 hover:text-brand-gold'>
										info@mirascarrental.com
									</a>
								</div>
							</div>

							<div className='flex gap-4'>
								<div className='flex-shrink-0'>
									<MapPin className='text-brand-gold' size={24} />
								</div>
								<div>
									<h3 className='font-semibold text-white mb-1'>
										Location
									</h3>
									<p className='text-gray-400'>
										Srinagar, Kashmir 190001
									</p>
								</div>
							</div>
						</div>

						{/* Why WhatsApp */}
						<div className='card p-6 bg-brand-gold/5 border-brand-gold/20'>
							<p className='text-sm text-gray-300'>
								💡 <strong>Tip:</strong> Use WhatsApp for instant
								replies and quick booking confirmations.
							</p>
						</div>
					</div>

					{/* Contact Form */}
					<div className='lg:col-span-2'>
						<div className='card p-8'>
							<h2 className='heading-3 mb-8'>Send us a Message</h2>

							<form onSubmit={handleSubmit} className='space-y-5'>
								<div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
									<div>
										<label className='label'>Full Name *</label>
										<input
											type='text'
											name='name'
											value={form.name}
											onChange={handleChange}
											placeholder='Your name'
											className='input'
										/>
									</div>
									<div>
										<label className='label'>Email *</label>
										<input
											type='email'
											name='email'
											value={form.email}
											onChange={handleChange}
											placeholder='your@email.com'
											className='input'
										/>
									</div>
								</div>

								<div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
									<div>
										<label className='label'>Phone *</label>
										<input
											type='tel'
											name='phone'
											value={form.phone}
											onChange={handleChange}
											placeholder='+91 98765 43210'
											className='input'
										/>
									</div>
									<div>
										<label className='label'>
											Car Model (Optional)
										</label>
										<input
											type='text'
											name='carName'
											value={form.carName}
											onChange={handleChange}
											placeholder='e.g. Mahindra Thar'
											className='input'
										/>
									</div>
								</div>

								<div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
									<div>
										<label className='label'>Start Date</label>
										<input
											type='date'
											name='pickupDate'
											value={form.pickupDate}
											onChange={handleChange}
											className='input'
										/>
									</div>
									<div>
										<label className='label'>End Date</label>
										<input
											type='date'
											name='dropoffDate'
											value={form.dropoffDate}
											onChange={handleChange}
											className='input'
										/>
									</div>
								</div>

								<div>
									<label className='label'>Message</label>
									<textarea
										name='message'
										value={form.message}
										onChange={handleChange}
										placeholder='Tell us about your travel plans...'
										rows={5}
										className='input resize-none'
									/>
								</div>

								<button
									type='submit'
									disabled={loading}
									className='btn-gold w-full py-3 font-semibold flex items-center justify-center gap-2'>
									{loading ? (
										<>
											<div className='w-4 h-4 border-2 border-dark-900/30 border-t-dark-900 rounded-full animate-spin' />
											Sending...
										</>
									) : (
										'Send Inquiry'
									)}
								</button>

								<p className='text-xs text-gray-500 text-center'>
									We'll respond to your inquiry within 2 hours during
									business hours.
								</p>
							</form>
						</div>
					</div>
				</div>
			</div>

			{/* FAQ Section */}
			<section className='bg-dark-800 py-20'>
				<div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
					<h2 className='heading-2 text-center mb-12'>
						Frequently Asked Questions
					</h2>

					<div className='space-y-4'>
						{[
							{
								q: 'What is the minimum age to rent a car?',
								a: 'You must be at least 21 years old with a valid driving license and an ID proof.',
							},
							{
								q: 'Is insurance included in the rental price?',
								a: 'Yes, basic insurance is included with all rentals. Optional premium coverage is also available.',
							},
							{
								q: 'Can I cancel my booking?',
								a: 'Free cancellation up to 24 hours before the rental. After that, some charges may apply.',
							},
							{
								q: 'Is delivery available?',
								a: 'Yes! We offer vehicle delivery and pickup across Kashmir at no extra charge.',
							},
						].map((item, i) => (
							<div key={i} className='card p-6'>
								<h3 className='font-semibold text-white mb-2'>
									{item.q}
								</h3>
								<p className='text-gray-400'>{item.a}</p>
							</div>
						))}
					</div>
				</div>
			</section>
		</div>
	);
}
