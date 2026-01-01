/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}",
    "./*.html",
  ],
  theme: {
    extend: {
      fontFamily: {
        playfair: ['"Playfair Display"', 'serif'],
      },
      colors: {
        gold: {
          50:  "#FFF8E1",
          100: "#FFE9A8",
          200: "#F3D878",
          300: "#E6C451",
          400: "#DDB43A",
          500: "#D4AF37", // Icon Gold
          600: "#B38F2A",
          700: "#8A6B1A",
          800: "#5E4A12",
          900: "#3A2D0A",
        },
        emerald: {
          50:  "#E7F5E9",
          100: "#CFEBD3",
          200: "#A5D9AF",
          300: "#79C28D",
          400: "#4CA46C",
          500: "#4e2121", // Primary Irish Green
          600: "#25662A",
          700: "#1D5222",
          800: "#143A18",
          900: "#0C2410",
        },
      },
    },
  },
  plugins: [],
}

