/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        saffron: {
          50: '#fff7ed',
          100: '#ffedd5',
          500: '#FF6B00',
          600: '#ea580c',
          700: '#c2410c',
        },
        india: {
          green: '#138808',
        },
      },
    },
  },
  plugins: [],
};
