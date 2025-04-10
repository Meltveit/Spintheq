/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,ts,jsx,tsx}",
      "./app/**/*.{js,ts,jsx,tsx}",
      "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          // Add custom colors here
          blue: {
            50: '#eff6ff',
            100: '#dbeafe',
            200: '#bfdbfe',
            300: '#93c5fd',
            400: '#60a5fa',
            500: '#3b82f6',
            600: '#2563eb',
            700: '#1d4ed8',
            800: '#1e40af',
            900: '#1e3a8a',
          },
        },
        fontFamily: {
          sans: ['var(--font-geist-sans)'],
          mono: ['var(--font-geist-mono)'],
        },
        borderRadius: {
          'xl': '0.75rem',
          '2xl': '1rem',
        },
        backdropFilter: {
          'none': 'none',
          'blur': 'blur(10px)',
        },
        animation: {
          'spin-slow': 'spin 3s cubic-bezier(0.25, 0.1, 0.25, 1) forwards',
        },
      },
    },
    plugins: [],
  }