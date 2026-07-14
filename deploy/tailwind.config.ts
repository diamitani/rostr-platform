import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'JetBrains Mono', 'monospace'],
      },
      colors: {
        accent: {
          DEFAULT: '#22d3ee',
          400: '#22d3ee',
          500: '#06b6d4',
        },
        surface: {
          DEFAULT: '#050505',
          50: '#0a0a0a',
          100: '#0f0f0f',
        },
      },
      borderRadius: {
        '2rem': '2rem',
      },
      animation: {
        breathe: 'breathe 3s ease-in-out infinite',
        float: 'float 8s ease-in-out infinite',
        'float-delayed': 'float 8s ease-in-out 2s infinite',
        'orb-1': 'orb1 20s ease-in-out infinite',
        'orb-2': 'orb2 25s ease-in-out infinite',
        'orb-3': 'orb3 30s ease-in-out infinite',
        shimmer: 'shimmer 2s ease-in-out infinite',
      },
      keyframes: {
        breathe: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        orb1: {
          '0%, 100%': { transform: 'translate(0%, 0%) scale(1)', opacity: '0.6' },
          '25%': { transform: 'translate(30%, -20%) scale(1.15)', opacity: '0.8' },
          '50%': { transform: 'translate(-10%, -40%) scale(0.9)', opacity: '0.5' },
          '75%': { transform: 'translate(-20%, 10%) scale(1.1)', opacity: '0.7' },
        },
        orb2: {
          '0%, 100%': { transform: 'translate(0%, 0%) scale(1)', opacity: '0.5' },
          '25%': { transform: 'translate(-25%, 15%) scale(1.2)', opacity: '0.7' },
          '50%': { transform: 'translate(15%, -25%) scale(0.85)', opacity: '0.4' },
          '75%': { transform: 'translate(25%, 20%) scale(1.05)', opacity: '0.6' },
        },
        orb3: {
          '0%, 100%': { transform: 'translate(0%, 0%) scale(1)', opacity: '0.4' },
          '33%': { transform: 'translate(20%, 30%) scale(1.1)', opacity: '0.6' },
          '66%': { transform: 'translate(-30%, -20%) scale(0.95)', opacity: '0.3' },
        },
        shimmer: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
