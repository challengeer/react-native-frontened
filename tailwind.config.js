/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          100: '#f3e8ff', // Tailwind purple 100
          200: '#e9d5ff', // Tailwind purple 200
          300: '#d8b4fe', // Tailwind purple 300
          400: '#c084fc', // Tailwind purple 400
          500: '#a855f7', // Tailwind purple 500
          600: '#9333ea', // Tailwind purple 600
          700: '#7e22ce', // Tailwind purple 700
          800: '#6b21a8', // Tailwind purple 800
          900: '#581c87', // Tailwind purple 900
        },
      },
    },
  },
  plugins: [],
}