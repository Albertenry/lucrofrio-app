/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}", // Inclui todos os arquivos React
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1D4ED8", // cor azul personalizada
      },
    },
  },
  plugins: [],
};
