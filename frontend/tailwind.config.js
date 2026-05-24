/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        forest: {
          50:  '#f1f6f2', 100: '#dfeae1', 200: '#bcd5c0', 300: '#90b797',
          400: '#5e9069', 500: '#3e7048', 600: '#2d5635', 700: '#244529',
          800: '#1c3621', 900: '#142719',
        },
        gold: {
          50: '#fbf6e8', 100: '#f5e9c2', 200: '#ecd286', 300: '#dfb853',
          400: '#caa138', 500: '#a68427', 600: '#80661c', 700: '#5d4a14',
        },
        cream: '#faf6ee',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'serif'],
        sans:    ['"Inter"', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gold-shine': 'linear-gradient(135deg,#dfb853 0%,#caa138 50%,#80661c 100%)',
      },
      boxShadow: { luxe: '0 25px 60px -15px rgba(20,39,25,0.45)' },
    },
  },
  plugins: [],
};
