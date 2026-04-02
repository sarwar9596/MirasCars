/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // New deep blue + champagne gold palette
        'miras-blue':      '#003366',
        'miras-blue-mid':  '#004080',
        'miras-blue-light':'#0055AA',
        'miras-gold':      '#C5A059',
        'miras-gold-light':'#D4B06A',
        'miras-dark':      '#1A1A1A',
        'miras-muted':     '#6B7280',
        'miras-light':     '#F8F9FA',
        'miras-offwhite':  '#E5E5E5',
        'miras-cream':     '#F5F5DC',
        'miras-white':     '#FFFFFF',
        'miras-nav-link':  '#D1D1D1',
      },
      fontFamily: {
        sans: ['Inter', 'Poppins', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
      },
      backgroundImage: {
        'hero-pattern': "url('/hero.jpeg')",
        'gradient-blue':  'linear-gradient(135deg, #003366 0%, #004080 50%, #003366 100%)',
        'gradient-gold':  'linear-gradient(135deg, #C5A059, #D4B06A)',
        'gradient-hero':  'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.6))',
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
