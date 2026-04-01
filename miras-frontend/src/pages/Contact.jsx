import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { inquiriesAPI } from '../utils/api';
import { Mail, MapPin, Phone, MessageCircle, Send, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Contact() {
	const [searchParams] = useSearchParams();
	const [form, setForm] = useState({
		name: '', email: '', phone: '', carName: '',
		pickupDate: '', dropoffDate: '', message: '',
	});
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const car = searchParams.get('car');
		if (car) setForm((f) => ({ ...f, carName: car }));
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
			await inquiriesAPI.create({ ...form, source: 'contact' });
			toast.success("Inquiry sent! We'll contact you soon.");
			setForm({ name: '', email: '', phone: '', carName: searchParams.get('car') || '', pickupDate: '', dropoffDate: '', message: '' });
		} catch {
			toast.error('Failed to send inquiry. Please try again.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div>
			{/* ── Header ──────────────────────────────── */}
			<section
				className='py-20 relative overflow-hidden'
				style={{ background: 'linear-gradient(135deg, #2FA4A9 0%, #6BC1B7 45%, #F5E6CA 100%)' }}
			>
				<div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					<span className='section-label mb-3 block'>Get in Touch</span>
					<h1 className='font-display font-bold text-white' style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>Contact Us</h1>
					<p className='text-lg mt-2' style={{ color: 'rgba(255,255,255,0.8)' }}>We'd love to hear from you — reach out anytime</p>
				</div>
				<div className='absolute bottom-0 left-0 w-full'>
					<svg viewBox='0 0 1440 80' fill='none' xmlns='http://www.w3.org/2000/svg' className='w-full' preserveAspectRatio='none' style={{ height: '70px' }}>
						<path d='M0,40 C320,80 640,10 960,45 C1200,65 1380,30 1440,25 L1440,80 L0,80 Z' fill='white' />
					</svg>
				</div>
			</section>

			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
				<div className='grid grid-cols-1 lg:grid-cols-3 gap-12'>
					{/* Contact Info */}
					<div className='space-y-8'>
						<h2 className='font-display font-bold' style={{ fontSize: '1.5rem', color: '#1A1A1A' }}>Let's Talk</h2>

						<div className='space-y-6'>
							{[
								{ icon: Phone, label: 'Phone', value: '+91 9103489268', href: 'tel:+919103489268', iconColor: '#2FA4A9' },
								{ icon: MessageCircle, label: 'WhatsApp', value: 'Chat instantly', href: 'https://wa.me/919103489268', iconColor: '#25D366' },
								{ icon: Mail, label: 'Email', value: 'info@mirasrentals.com', href: 'mailto:info@mirasrentals.com', iconColor: '#2FA4A9' },
								{ icon: MapPin, label: 'Location', value: 'Residency Road, Lal Chowk, Srinagar, J&K 190001', href: null, iconColor: '#2FA4A9' },
							].map(({ icon: Icon, label, value, href, iconColor }) => (
								<div key={label} className='flex gap-4'>
									<div className='mt-1' style={{ color: iconColor }}><Icon size={22} /></div>
									<div>
										<p className='text-sm mb-0.5' style={{ color: '#6B7280' }}>{label}</p>
										{href ? (
											<a href={href} target='_blank' rel='noopener noreferrer'
												className='font-semibold hover:underline' style={{ color: iconColor }}>
												{value}
											</a>
										) : (
											<p className='font-semibold' style={{ color: '#1A1A1A' }}>{value}</p>
										)}
									</div>
								</div>
							))}
						</div>

						{/* WhatsApp tip */}
						<div className='card-glass p-6' style={{ background: 'rgba(37,211,102,0.08)' }}>
							<div className='flex items-center gap-2 mb-2'>
								<Clock size={16} style={{ color: '#2FA4A9' }} />
								<p className='font-bold text-sm' style={{ color: '#2FA4A9' }}>Quickest Response</p>
							</div>
							<p className='text-sm mb-4' style={{ color: '#6B7280' }}>For fastest replies, message us on WhatsApp. We typically respond within minutes.</p>
							<a href='https://wa.me/919103489268' target='_blank' rel='noopener noreferrer'
								className='inline-flex items-center gap-2 btn-cta text-sm px-5 py-2'>
								💬 Chat on WhatsApp
							</a>
						</div>

						{/* Hours */}
						<div className='card-glass p-6'>
							<p className='font-bold mb-3' style={{ color: '#1A1A1A' }}>Business Hours</p>
							{[
								['Mon – Sat', '8:00 AM – 9:00 PM'],
								['Sunday', '9:00 AM – 7:00 PM'],
								['Emergency', '24/7 Roadside Support'],
							].map(([day, time]) => (
								<div key={day} className='flex justify-between text-sm py-2' style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
									<span style={{ color: '#6B7280' }}>{day}</span>
									<span className='font-medium' style={{ color: '#1A1A1A' }}>{time}</span>
								</div>
							))}
						</div>
					</div>

					{/* Contact Form */}
					<div className='lg:col-span-2'>
						<div className='form-glass'>
							<div className='flex items-center gap-3 mb-8'>
								<div className='w-10 h-10 rounded-xl flex items-center justify-center' style={{ background: 'rgba(47,164,169,0.12)' }}>
									<Send size={18} style={{ color: '#2FA4A9' }} />
								</div>
								<h2 className='font-display font-bold' style={{ fontSize: '1.4rem', color: '#1A1A1A' }}>Send an Inquiry</h2>
							</div>

							<form onSubmit={handleSubmit} className='space-y-5'>
								<div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
									<div>
										<label className='block text-sm font-semibold mb-2' style={{ color: '#1A1A1A' }}>Full Name *</label>
										<input type='text' name='name' value={form.name} onChange={handleChange}
											placeholder='Your full name' className='input-glass' required />
									</div>
									<div>
										<label className='block text-sm font-semibold mb-2' style={{ color: '#1A1A1A' }}>Phone *</label>
										<input type='tel' name='phone' value={form.phone} onChange={handleChange}
											placeholder='+91 XXXXX XXXXX' className='input-glass' required />
									</div>
								</div>
								<div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
									<div>
										<label className='block text-sm font-semibold mb-2' style={{ color: '#1A1A1A' }}>Email</label>
										<input type='email' name='email' value={form.email} onChange={handleChange}
											placeholder='your@email.com' className='input-glass' />
									</div>
									<div>
										<label className='block text-sm font-semibold mb-2' style={{ color: '#1A1A1A' }}>Interested Car (Optional)</label>
										<input type='text' name='carName' value={form.carName} onChange={handleChange}
											placeholder='e.g. Mahindra Thar' className='input-glass' />
									</div>
								</div>
								<div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
									<div>
										<label className='block text-sm font-semibold mb-2' style={{ color: '#1A1A1A' }}>Pickup Date</label>
										<input type='date' name='pickupDate' value={form.pickupDate} onChange={handleChange} className='input-glass' />
									</div>
									<div>
										<label className='block text-sm font-semibold mb-2' style={{ color: '#1A1A1A' }}>Return Date</label>
										<input type='date' name='dropoffDate' value={form.dropoffDate} onChange={handleChange} className='input-glass' />
									</div>
								</div>
								<div>
									<label className='block text-sm font-semibold mb-2' style={{ color: '#1A1A1A' }}>Message</label>
									<textarea name='message' value={form.message} onChange={handleChange}
										placeholder='Tell us about your trip plans, number of travelers, preferred route…'
										rows={5} className='input-glass resize-none' />
								</div>
								<button type='submit' disabled={loading}
									className='btn-cta w-full py-3.5 text-base justify-center'>
									{loading ? (
										<><div className='w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin' />Sending…</>
									) : (
										<>Send Inquiry <Send size={16} /></>
									)}
								</button>
								<p className='text-xs text-center' style={{ color: '#6B7280' }}>We respond to all inquiries within 2 hours during business hours</p>
							</form>
						</div>
					</div>
				</div>
			</div>

			{/* FAQ */}
			<section className='py-16' style={{ background: '#F8F9FA' }}>
				<div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
					<h2 className='font-display font-bold text-center mb-12' style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', color: '#1A1A1A' }}>
						Frequently Asked Questions
					</h2>
					<div className='space-y-4'>
						{[
							{ q: 'What is the minimum age to rent a car?', a: 'You must be at least 21 years old with a valid driving license and government ID proof.' },
							{ q: 'Is insurance included in the rental price?', a: 'Yes, comprehensive insurance is included with all rentals. Additional premium coverage is also available.' },
							{ q: 'Can I cancel my booking?', a: 'Free cancellation up to 24 hours before the rental. After that, standard cancellation charges may apply.' },
							{ q: 'Do you offer self-drive or with-driver options?', a: 'Both! Choose self-drive if you have a valid license, or opt for one of our experienced local drivers.' },
						].map((item, i) => (
							<div key={i} className='faq-item'>
								<h3 className='font-bold mb-2' style={{ color: '#1A1A1A' }}>{item.q}</h3>
								<p className='text-sm' style={{ color: '#6B7280' }}>{item.a}</p>
							</div>
						))}
					</div>
				</div>
			</section>
		</div>
	);
}
