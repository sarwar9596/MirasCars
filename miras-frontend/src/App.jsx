import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import Layout from './components/Layout';
import Home from './pages/Home';
import Cars from './pages/Cars';
import CarDetail from './pages/CarDetail';
import Blogs from './pages/Blogs';
import BlogDetail from './pages/BlogDetail';
import About from './pages/About';
import Contact from './pages/Contact';

function ScrollToTop() {
	const { pathname } = useLocation();
	useEffect(() => {
		window.scrollTo(0, 0);
	}, [pathname]);
	return null;
}

export default function App() {
	return (
		<BrowserRouter>
			<ScrollToTop />
			<Toaster position='top-right' toastOptions={{ duration: 4000 }} />
			<Routes>
				<Route path='/' element={<Layout />}>
					<Route index element={<Home />} />
					<Route path='cars' element={<Cars />} />
					<Route path='cars/:slug' element={<CarDetail />} />
					<Route path='blogs' element={<Blogs />} />
					<Route path='blog/:slug' element={<BlogDetail />} />
					<Route path='about' element={<About />} />
					<Route path='contact' element={<Contact />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
}
