/** @type {import('tailwindcss').Config} */
export default {
  // aplica tailwind a todos los archivos del proyecto
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      // paleta monocromática en blanco y negro
      colors: {
        naranja: {
          50:  '#fafafa',
          100: '#f4f4f5',
          200: '#e4e4e7',
          300: '#d4d4d8',
          400: '#ffffff',
          500: '#ffffff', // Acento principal: blanco puro
          600: '#e4e4e7',
          700: '#a1a1aa',
        },
        dorado: {
          400: '#e4e4e7',
          500: '#d4d4d8',
          600: '#a1a1aa',
        },
        oscuro: {
          950: '#000000',
          900: '#09090b',
          800: '#121215',
          700: '#18181b',
          600: '#27272a',
        },
      },
      // fuente principal
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
      },
      // animacones extra
      animation: {
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'fade-in': 'fadeIn 0.4s ease-out',
        'bounce-soft': 'bounceSoft 0.5s ease-out',
      },
      keyframes: {
        slideInRight: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        bounceSoft: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.15)' },
        },
      },
    },
  },
  plugins: [],
}
