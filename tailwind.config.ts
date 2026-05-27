import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50:  '#FDFAF5',
          100: '#F7F0E3',
          200: '#F0E6D3',
          300: '#E5D8C0',
          400: '#D4B896',
          500: '#C4A882',
        },
        bark: {
          300: '#C4A882',
          400: '#A67C52',
          500: '#8B6340',
          600: '#7A5C35',
          700: '#5C4020',
          800: '#3D2B1F',
          900: '#2A1D13',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(90, 60, 30, 0.08), 0 1px 2px -1px rgba(90, 60, 30, 0.06)',
        'card-hover': '0 4px 12px 0 rgba(90, 60, 30, 0.12), 0 2px 4px -1px rgba(90, 60, 30, 0.08)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
