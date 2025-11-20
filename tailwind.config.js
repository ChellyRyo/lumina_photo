/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        serif: ['Cinzel', 'serif'],
      },
      colors: {
        apple: {
          bg: '#F5F5F7',
          gray: '#86868b',
          blue: '#0066CC',
        }
      }
    },
  },
  plugins: [],
}