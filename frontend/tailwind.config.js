/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",

  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        deep: "#0d1117",
        card: "#161b27",
        elevated: "#1e2535",
        emerald: "#10b981",
        accent: "#38bdf8",
      },

      fontFamily: {
        display: ["Sora", "sans-serif"],
        body: ["DM Sans", "sans-serif"],
      }
    },
  },

  plugins: [],
}