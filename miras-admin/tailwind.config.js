/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        body: ['DM Sans', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#1F7A4D',
          dark: '#17633E',
          light: '#2E8B57',
        },
        brand: {
          gold: '#C9A84C',
          'gold-light': '#E8C96A',
          'gold-dark': '#A07C30',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          raised: '#F5F7F6',
          overlay: '#EEF1EF',
        },
        ui: {
          main: '#F5F7F6',
          sidebar: '#FFFFFF',
          card: '#FFFFFF',
          border: 'rgba(0,0,0,0.04)',
          borderActive: 'rgba(31,122,77,0.2)',
        },
        text: {
          primary: '#1A1A1A',
          secondary: '#6B7280',
          muted: '#9CA3AF',
          white: '#FFFFFF',
        },
        status: {
          success: '#22C55E',
          warning: '#F59E0B',
          danger: '#EF4444',
          info: '#3B82F6',
        },
        chart: {
          1: '#1F7A4D',
          2: '#2E8B57',
          3: '#6FCF97',
          muted: '#E5E7EB',
        },
        input: {
          bg: '#F1F3F2',
          border: 'transparent',
          text: '#1A1A1A',
          placeholder: '#9CA3AF',
        },
      },
      backgroundImage: {
        'primary-gradient': 'linear-gradient(135deg, #1F7A4D, #2E8B57)',
        'gold-gradient': 'linear-gradient(135deg, #C9A84C, #E8C96A, #A07C30)',
      },
      boxShadow: {
        card: '0 6px 20px rgba(0,0,0,0.05)',
        'card-hover': '0 10px 32px rgba(0,0,0,0.08)',
        'card-lg': '0 16px 48px rgba(0,0,0,0.1)',
        input: '0 1px 3px rgba(0,0,0,0.04)',
        sidebar: '2px 0 12px rgba(0,0,0,0.04)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease forwards',
        'slide-up': 'slideUp 0.4s ease forwards',
      },
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(16px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
      }
    },
  },
  plugins: [],
}
