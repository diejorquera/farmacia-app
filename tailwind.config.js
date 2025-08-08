/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Brand color palette
        'brand-dark':       '#313A44', // Fondo o encabezado principal
        'brand-muted':      '#696969', // Texto secundario o elementos sutiles
        'brand-background': '#f5f3ed', // Fondo general claro
      },
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
