import { Link } from 'react-router-dom';

export default function About() {
	return (
		<div className='min-h-screen bg-dark-900'>
			<section className='py-20'>
				<div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
					<h1 className='heading-1 mb-8'>About Miras</h1>

					<div className='prose prose-invert max-w-none space-y-6 text-lg text-gray-300 mb-12'>
						<p>
							Miras Car Rental is your trusted partner for exploring
							the breathtaking landscapes of Kashmir. With years of
							experience in the travel and transportation industry,
							we've built our reputation on reliability, quality, and
							customer satisfaction.
						</p>

						<h2 className='heading-3 text-white mt-8'>Our Mission</h2>
						<p>
							To provide premium car rental services and authentic
							travel experiences that transform the way people explore
							Kashmir. We believe in empowering travelers with the
							freedom to discover this paradise at their own pace.
						</p>

						<h2 className='heading-3 text-white mt-8'>
							Why Choose Miras?
						</h2>
						<ul className='space-y-3 list-disc list-inside'>
							<li>
								Wide range of vehicles for every budget and
								requirement
							</li>
							<li>24/7 roadside assistance and customer support</li>
							<li>Transparent pricing with no hidden charges</li>
							<li>Expert local guides and travel recommendations</li>
							<li>Insurance and safety features included</li>
							<li>Flexible booking and cancellation policies</li>
						</ul>

						<h2 className='heading-3 text-white mt-8'>Our Fleet</h2>
						<p>
							From economical hatchbacks to luxury SUVs, we maintain a
							diverse fleet of well-maintained vehicles. Every car is
							regularly serviced and inspected to ensure your safety
							and comfort on every journey.
						</p>

						<h2 className='heading-3 text-white mt-8'>
							Get in Touch
						</h2>
						<p>
							Have questions? Want to book a car or need travel
							advice? We're here to help! Contact us through WhatsApp,
							phone, or visit our website. Our team is available 24/7
							to assist you.
						</p>
					</div>

					<div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-12'>
						{[
							{
								icon: '🚗',
								title: '500+ Vehicles',
								desc: 'Diverse fleet for all needs',
							},
							{
								icon: '😊',
								title: '10K+ Customers',
								desc: 'Happy travelers every year',
							},
							{
								icon: '⭐',
								title: '4.9★ Rating',
								desc: 'Trusted & recommended',
							},
						].map((stat, i) => (
							<div key={i} className='card p-6 text-center'>
								<div className='text-4xl mb-3'>{stat.icon}</div>
								<h3 className='font-bold text-white'>{stat.title}</h3>
								<p className='text-gray-400 text-sm mt-1'>
									{stat.desc}
								</p>
							</div>
						))}
					</div>

					<div className='bg-gradient-to-r from-brand-gold/10 to-brand-gold/5 border border-brand-gold/20 rounded-2xl p-8 text-center'>
						<h3 className='text-2xl font-bold text-white mb-3'>
							Ready to Explore?
						</h3>
						<p className='text-gray-400 mb-6'>
							Start your Kashmir adventure with Miras today
						</p>
						<Link to='/cars' className='btn-gold'>
							Browse Our Fleet
						</Link>
					</div>
				</div>
			</section>
		</div>
	);
}
