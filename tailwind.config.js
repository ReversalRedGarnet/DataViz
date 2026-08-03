/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        // PLACEHOLDER — intentionally empty until the design touch-up pass.
        // Derive real tokens from the locked hazard + country story rather
        // than defaulting to Tailwind's stock blue-600 or a generic
        // cream+terracotta / near-black+neon look.
      },
    },
  },
  plugins: [],
}
