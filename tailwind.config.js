const defaultTheme = require('tailwindcss/defaultTheme');
const plugin = require('tailwindcss/plugin');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './ui/**/*.{js,ts,jsx,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '0.75rem', // Responsive padding is not working? :(
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', ...defaultTheme.fontFamily.sans],
        headline: ['var(--font-headline)', ...defaultTheme.fontFamily.sans],
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
      boxShadow: {
        border:
          '0px 1px 3px 0px rgba(0 0 0 / 0.02), 0px 0px 0px 1px rgba(27 31 35 / 0.15)',
        card: '0 1px 3px 0 #c9cfd8, 0 1px 2px -1px #c9cfd8, 0px 0px 0px 1px #e2e6eb',
      },
      textShadow: {
        xs: '0 1px 1px var(--tw-shadow-color)',
        sm: '0 1px 2px var(--tw-shadow-color)',
        DEFAULT: '0 2px 4px var(--tw-shadow-color)',
        lg: '0 8px 16px var(--tw-shadow-color)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
    data: {
      active: 'state~="active"',
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('tailwindcss-animate'),
    plugin(function ({ matchUtilities, theme }) {
      matchUtilities(
        {
          'text-shadow': value => ({
            textShadow: value,
          }),
        },
        { values: theme('textShadow') }
      );
    }),
  ],
};
