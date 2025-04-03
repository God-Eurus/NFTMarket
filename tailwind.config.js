/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'neon-pink': '#ff71ce',
        'neon-blue': '#01cdfe',
        'neon-green': '#05ffa1',
        'neon-purple': '#b967ff',
      },
      fontFamily: {
        retro: ['"Press Start 2P"', 'cursive'],
      },
    },
  },
  plugins: [],
}