/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // New modern palette
        'miras-teal':    '#2FA4A9',
        'miras-teal-light': '#6BC1B7',
        'miras-cream':   '#F5E6CA',
        'miras-orange':  '#FF8A3D',
        'miras-gold':    '#F2994A',
        'miras-dark':    '#1A1A1A',
        'miras-muted':   '#6B7280',
        'miras-light':   '#F8F9FA',
      },
      fontFamily: {
        sans: ['Inter', 'Poppins', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
      },
      backgroundImage: {
        'hero-pattern': "url('/hero.jpeg')",
        'gradient-miras': 'linear-gradient(135deg, #2FA4A9 0%, #6BC1B7 45%, #F5E6CA 100%)',
        'gradient-cta': 'linear-gradient(135deg, #FF8A3D, #F2994A)',
      },
      backgroundSize: {
        '200': '200% 200%',
      },
      keyframes: {
        gradientShift: {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '100% 50%' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      animation: {
        'gradient-shift': 'gradientShift 8s ease infinite',
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'float': 'float 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
