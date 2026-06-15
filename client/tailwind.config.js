/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: "#06070a",
        cardBg: "rgba(13, 16, 27, 0.7)",
        accentBlue: "#3b82f6",
        accentCyan: "#06b6d4",
        accentPurple: "#8b5cf6",
        accentPink: "#ec4899",
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
