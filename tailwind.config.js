/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Soft ocean blue + soft sun yellow, per the design brief.
        ocean: '#5B8FA3',
        'ocean-light': '#DCEEF2',
        sun: '#F0C868',
        'sun-light': '#FBF1DC',
        ink: '#24333A',
        sand: '#FAF7F0',
      },
    },
  },
  plugins: [],
}
