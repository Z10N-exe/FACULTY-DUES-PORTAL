/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0A8F3C',
        secondary: '#E8F5E9',
      }
    },
  },
  plugins: [],
}
