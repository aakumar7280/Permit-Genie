/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Palette: Carbon / White / Alabaster / Dust / Flame
        gray: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#E6E8E6',   // Alabaster Grey
          300: '#CED0CE',   // Dust Grey
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#222222',
          900: '#191919',   // Carbon Black
          950: '#111111',
        },
        accent: {
          50: '#fff5f2',
          100: '#ffe8e0',
          200: '#ffcbb8',
          300: '#ffa58a',
          400: '#F15025',   // Blazing Flame
          500: '#F15025',
          600: '#d9441d',
          700: '#b53616',
          800: '#8c2b12',
          900: '#6b2110',
        },
        electric: {
          50: '#fff5f2',
          100: '#ffe8e0',
          200: '#ffcbb8',
          300: '#ffa58a',
          400: '#F15025',
          500: '#F15025',
          600: '#d9441d',
          700: '#b53616',
          800: '#8c2b12',
          900: '#6b2110',
        },
      },
      backgroundImage: {
        'gradient-future': 'linear-gradient(135deg, #191919 0%, #222222 50%, #2d2d2d 100%)',
        'gradient-glass': 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)',
        'gradient-accent': 'linear-gradient(135deg, #F15025 0%, #d9441d 100%)',
        'gradient-surface': 'linear-gradient(135deg, #191919 0%, #222222 50%, #2d2d2d 100%)',
        'gradient-border': 'linear-gradient(90deg, transparent, rgba(241, 80, 37, 0.5), transparent)',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(241, 80, 37, 0.25)',
        'glow-lg': '0 0 40px rgba(241, 80, 37, 0.15)',
        'inner-glow': 'inset 0 1px 0 rgba(255, 255, 255, 0.08)',
        'modern': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(255, 255, 255, 0.04)',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite alternate',
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%': { boxShadow: '0 0 20px rgba(241, 80, 37, 0.25)' },
          '100%': { boxShadow: '0 0 30px rgba(241, 80, 37, 0.4)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        'shimmer': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
    },
  },
  plugins: [],
}
