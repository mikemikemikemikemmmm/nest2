/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        aside:'#4d494a',
        asideHover:'#bb9064'
      }
    },
  },
  plugins: [],
}  