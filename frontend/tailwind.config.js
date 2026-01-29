/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gob: {
          primary: '#572671',   // Morado oficial
          secondary: '#FEE6C4', // Crema oficial
          rosa: '#AA0365',      // Rosa oficial
          verde: '#91ABA5',     // Verde oficial
        }
      },
    },
  },
  plugins: [],
}