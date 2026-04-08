/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        doraemon: {
          blue: '#009FE3',
          red: '#E60012',
          yellow: '#F8B62D',
          white: '#FFFFFF',
          black: '#1A1A1A',
        }
      },
      fontFamily: {
        doraemon: ['Nunito', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
