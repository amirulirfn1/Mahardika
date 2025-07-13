/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['apps/web/src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#0d1b2a',
        accent: '#f4b400',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms')({
      strategy: 'class',
    }),
    require('@tailwindcss/typography'),
  ],
};
