/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          100: '#FAF4EF',
          200: '#F6E9E1',
          300: '#F1DDD0',
          400: '#ECD2C0',
          500: '#EBC7B0',
        },
        secondary: {
          100: '#C1BEAE',
          200: '#B8B5A3',
          300: '#AFAC97',
          400: '#A6A38C',
          500: '#9D9A80',
        },
        shades: {
          100: '#F5F5F5',
          200: '#EEEEEE',
          300: '#E0E0E0',
          400: '#BDBDBD',
          500: '#9E9E9E',
        },
      },
    },
    plugins: [
      require('@tailwindcss/forms'),
      require('@tailwindcss/aspect-ratio'),
      require('@tailwindcss/typography'),
    ],
  },
};
