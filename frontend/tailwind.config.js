/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        agri: {
          50: '#F2F9F3',
          100: '#E1F2E4',
          200: '#C2E5C7',
          300: '#95D1A0',
          400: '#5FB670',
          500: '#2E9E44',
          600: '#1F7D33',
          700: '#17642A',
          800: '#154F24',
          900: '#123F1F',
          dark: '#0C2B14',
        },
        cream: {
          50: '#FDFCF7',
          100: '#FAF8F0',
          200: '#F4F0E2',
          300: '#EAE4D0',
        },
        accent: {
          amber: '#F59E0B',
          gold: '#EAB308',
          leaf: '#84CC16',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(18, 63, 31, 0.08)',
        'soft-lg': '0 10px 25px -3px rgba(18, 63, 31, 0.12)',
        'card': '0 2px 12px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.02)',
      }
    },
  },
  plugins: [],
}
