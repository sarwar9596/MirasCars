/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			colors: {
				'dark-900': '#0A0C0F',
				'dark-800': '#11131A',
				'dark-700': '#16191F',
				'dark-600': '#1F232B',
				'dark-500': '#272D3A',
				'dark-400': '#313847',
				'dark-300': '#3A414F',
				'brand-gold': '#C9A84C',
				'brand-gold-light': '#E8C96A',
				surface: '#11131A',
				'surface-raised': '#16191F',
			},
			fontFamily: {
				display: ['Poppins', 'sans-serif'],
			},
			boxShadow: {
				card: '0 4px 20px rgba(0, 0, 0, 0.3)',
				'card-hover': '0 8px 32px rgba(201, 168, 76, 0.15)',
				gold: '0 0 20px rgba(201, 168, 76, 0.3)',
				'gold-lg': '0 0 40px rgba(201, 168, 76, 0.4)',
			},
		},
	},
	plugins: [],
};
