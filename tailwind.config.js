/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6', // blue
        accent: '#22c55e', // green
        appleRed: '#ff3b30',
        glass: 'rgba(255,255,255,0.7)'
      },
      borderRadius: {
        xl: '1.25rem',
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
};
