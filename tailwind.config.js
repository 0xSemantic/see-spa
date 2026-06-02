export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'spa-yellow': '#fef7d2',
        'spa-green': '#e6f3e6',
        'spa-primary': '#c7e9c0',
        'spa-accent': '#fae67c',
        'spa-dark': '#3d5a3e',
        'spa-text': '#2c3e2d',
        'spa-muted': '#7a9e7b',
      },
      fontFamily: {
        'display': ['"Cormorant Garamond"', 'serif'],
        'body': ['"DM Sans"', 'sans-serif'],
        'mono': ['"DM Mono"', 'monospace'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      }
    }
  },
  plugins: [],
}
