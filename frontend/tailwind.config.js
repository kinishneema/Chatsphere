// tailwind.config.js

const daisyui = require('daisyui'); // Use `require` here

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [daisyui], // Use `daisyui` directly in the plugins array
}
