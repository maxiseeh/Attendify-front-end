/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#273BE2',
        'primary-light': '#4F6BFF',
        'primary-dark': '#1a2ab0',
      },
    },
  },
  plugins: [],
}