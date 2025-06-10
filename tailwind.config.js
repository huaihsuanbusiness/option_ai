/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#0D1117',
        primary: '#22D3EE',
        secondary: '#A78BFA',
        'surface-card': 'rgba(255, 255, 255, 0.05)',
        'surface-border': 'rgba(255, 255, 255, 0.1)',
      },
      fontFamily: {
        sans: ['Satoshi', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      animation: {
        'pulse': 'pulse 3s ease-in-out infinite',
      }
    },
  },
  plugins: [],
};
