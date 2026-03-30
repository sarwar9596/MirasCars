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
        brand: {
          gold: '#C9A84C',
          'gold-light': '#E8C96A',
          'gold-dark': '#A07C30',
        },
        dark: {
          900: '#0A0C0F',
          800: '#111318',
          700: '#181C23',
          600: '#1E2330',
          500: '#252B38',
          400: '#2E3545',
          300: '#3D4558',
        },
        surface: {
          DEFAULT: '#181C23',
          raised: '#1E2330',
          overlay: '#252B38',
        }
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #C9A84C, #E8C96A, #A07C30)',
        'dark-gradient': 'linear-gradient(180deg, #111318 0%, #0A0C0F 100%)',
      },
      boxShadow: {
        'gold': '0 0 20px rgba(201, 168, 76, 0.15)',
        'gold-lg': '0 0 40px rgba(201, 168, 76, 0.2)',
        'card': '0 4px 24px rgba(0,0,0,0.4)',
        'card-lg': '0 8px 48px rgba(0,0,0,0.5)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease forwards',
        'slide-up': 'slideUp 0.4s ease forwards',
        'pulse-gold': 'pulseGold 2s infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(16px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        pulseGold: { '0%,100%': { boxShadow: '0 0 0 0 rgba(201,168,76,0.4)' }, '50%': { boxShadow: '0 0 0 8px rgba(201,168,76,0)' } },
      }
    },
  },
  plugins: [],
}
