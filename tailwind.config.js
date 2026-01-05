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
        maroon: {
          DEFAULT: "#612727", // rich classic maroon
          oak: "#4D1519",     // Maroon Oak (deep, earthy)
          cherry: "#2F161D",  // Black Cherry
          wine: "#654754",    // Wine Stain
          jazz: "#5D272D",    // Jazz (warm red-brown)
        },
        brown: {
          derby: "#594836",  // Brown Derby
          seal: "#301413",   // Seal Brown
          soy: "#170704",    // Soy Sauce (nearly black)
        },
        neutral: {
          weather: "#A1937E", // Weather Board
          metal: "#A18B8E",   // Metal Ruins
        },
      },
    },
  },
  plugins: [],
}

