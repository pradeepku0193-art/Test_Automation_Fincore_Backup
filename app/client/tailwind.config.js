/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0d1117',
          surface: '#161b22',
          border: '#30363d',
          hover: '#21262d',
          text: {
            primary: '#e6edf3',
            secondary: '#8b949e',
            muted: '#6e7681'
          }
        },
        accent: {
          blue: '#58a6ff',
          purple: '#bc8cff',
          green: '#3fb950',
          red: '#f85149',
          yellow: '#d29922',
          orange: '#ff8c00'
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif']
      },
      boxShadow: {
        'glow-blue': '0 0 20px rgba(88, 166, 255, 0.3)',
        'glow-purple': '0 0 20px rgba(188, 140, 255, 0.3)'
      }
    },
  },
  plugins: [],
}
