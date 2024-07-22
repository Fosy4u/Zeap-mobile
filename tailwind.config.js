/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        baseGreen: "#133522",
        lightGreen: "#D5F4E3",
        lightGold: "#FFFAF2",
        gold: "#D5B07B",
        orange: "#ddb31d",
        black: "#151518",
        lightGray: "#F3F4F6",
      },
    },
  },
  plugins: [],
}

