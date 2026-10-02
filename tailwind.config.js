/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#18322c',
          green: '#3ecf8e',
          lightGreen: '#e8f8ef',
          bg: '#fafcfa',
          muted: '#60736c',
          blue: '#3e7acf',
          cream: '#edecdd',
          card: '#f2f8f4',
          border: '#bfd8c8',
        }
      },
      fontFamily: {
        sans: ['"Noto Sans KR"', 'Inter', 'sans-serif'],
      },
      borderRadius: {
        '20': '20px',
        '24': '24px',
      }
    },
  },
  plugins: [],
}
