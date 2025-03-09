/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#818cf8', // indigo-400
          DEFAULT: '#6366f1', // indigo-500
          dark: '#4f46e5', // indigo-600
        },
        secondary: {
          light: '#c4b5fd', // violet-300
          DEFAULT: '#a78bfa', // violet-400
          dark: '#8b5cf6', // violet-500
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    // line-clamp is now built into Tailwind CSS v3.3+
  ],
}; 