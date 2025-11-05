/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#0f172a',      // slate-950
          surface: '#1e293b', // slate-800
          primary: '#7c3aed', // purple-700
          'primary-hover': '#6d28d9', // purple-800
          border: '#1e293b',  // slate-800
          text: '#f1f5f9',    // slate-100
          'text-secondary': '#94a3b8', // slate-400
          'text-muted': '#64748b', // slate-500
        },
        // Keep primary for backward compatibility, but use brand.primary
        primary: {
          700: '#7c3aed', // purple-700
          600: '#6d28d9', // purple-800 (for hover)
        },
      },
    },
  },
  plugins: [],
}

