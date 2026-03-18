/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#42147D',    // Morado principal
        secondary: '#fee6c4',  // Crema
        rosa: '#aa0365',       // Rosa
        rojo: '#A70F26',       // Rojo
        verde: '#6FB225',      // Verde
        azul: '#55AEC9',       // Azul
        naranja: '#EF8D00',    // Naranja
        morado: '#42147D',     // Morado
      },
    },
  },
  plugins: [],
}