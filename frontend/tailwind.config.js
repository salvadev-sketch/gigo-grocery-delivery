/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#166534",
          dark: "#052e16",
          accent: "#f97316"
        }
      }
    },
  },
  plugins: [],
}
