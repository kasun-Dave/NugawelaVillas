/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ivory: {
          DEFAULT: '#F7F3ED',
          50: '#FDFCFA',
          100: '#F7F3ED',
          200: '#EDE6DA',
          300: '#E0D5C4',
        },
        mist: {
          DEFAULT: '#E8ECE9',
          50: '#F4F7F5',
          100: '#E8ECE9',
          200: '#D4DBD6',
        },
        forest: {
          DEFAULT: '#2D4A3E',
          50: '#E8F0EC',
          100: '#C5D9CE',
          200: '#8FB59E',
          300: '#5A8A72',
          400: '#3D6B56',
          500: '#2D4A3E',
          600: '#243D33',
          700: '#1B2F27',
          800: '#12211C',
          900: '#0A1410',
        },
        charcoal: {
          DEFAULT: '#2C2C2C',
          50: '#F5F5F5',
          100: '#E8E8E8',
          200: '#D1D1D1',
          300: '#A8A8A8',
          400: '#7A7A7A',
          500: '#5C5C5C',
          600: '#4A4A4A',
          700: '#3D3D3D',
          800: '#2C2C2C',
          900: '#1A1A1A',
        },
        gold: {
          DEFAULT: '#C4A265',
          50: '#F9F3E8',
          100: '#F0E4CC',
          200: '#E0C99A',
          300: '#C4A265',
          400: '#A8884F',
          500: '#8B6F3E',
        },
        terracotta: {
          DEFAULT: '#B85C38',
          50: '#FDF0EA',
          100: '#F5D9C8',
          200: '#E8B896',
          300: '#D4926A',
          400: '#B85C38',
          500: '#9A4A2C',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
