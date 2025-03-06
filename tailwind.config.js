/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'sl-dark-purple': '#221426',
        'sl-soft-purple': '#A480F2',
        'sl-dark-violet': '#1D1340',
        'sl-blue': '#445EF2',
        'sl-light-gray': '#F2F2F2',
        'sl-black': '#0A0A0A',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Orbitron', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(164, 128, 242, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(164, 128, 242, 0.8)' },
        },
      },
    },
  },
  plugins: [],
};