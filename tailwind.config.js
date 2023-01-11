const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        primary: {
          50: '#f1f5fc',
          100: '#e5ecfa',
          200: '#d0dcf5',
          300: '#b4c5ed',
          400: '#96a6e3',
          500: '#8490db',
          600: '#6167ca',
          700: '#5155b1',
          800: '#44498f',
          900: '#3c4073',
        },
        secondary: {
          50: '#f4f6f7',
          100: '#e2e6eb',
          200: '#c9cfd8',
          300: '#a3aebd',
          400: '#76859a',
          500: '#64748b',
          600: '#4e596c',
          700: '#444b5a',
          800: '#3d424d',
          900: '#363a43',
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography'), require('@tailwindcss/forms')],
};
