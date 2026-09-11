/** @type {import('tailwindcss').Config} */
export default {
  // aplica tailwind a todos los archivos del proyecto
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      // Paleta oficial de marca "Moscú" (Vino / Borgoña + Crema suave)
      colors: {
        naranja: {
          50:  '#FAF7F5',
          100: '#F5EFEB',
          200: '#EBE2DB', // Crema exacto de la marca
          300: '#D4A8BF', // Rosa malva suave
          400: '#C74885', // Berry / Vino luminoso (alta visibilidad)
          500: '#871C53', // Vino brillante (botones y acentos principales)
          600: '#66153E', // Vino medio (hover y estados activos)
          700: '#4D0F30', // Vino profundo oficial Moscú
          800: '#380B23', // Vino oscuro
          900: '#240616', // Vino noche
        },
        dorado: {
          300: '#FAF7F5',
          400: '#F0DFCD',
          500: '#EBE2DB', // Crema de marca
          600: '#C9B4A4',
          700: '#A89282',
        },
        crema: {
          50:  '#FFFFFF',
          100: '#FAF7F5',
          200: '#F5EFEB',
          300: '#EBE2DB',
          400: '#DFCFC4',
          500: '#C9B4A4',
        },
        vino: {
          400: '#C74885',
          500: '#871C53',
          600: '#66153E',
          700: '#4D0F30',
          800: '#380B23',
          900: '#240616',
        },
        oscuro: {
          950: '#070406',
          900: '#0E0A0D',
          800: '#171216',
          700: '#221B21',
          600: '#332A32',
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
