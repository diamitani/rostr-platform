import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'JetBrains Mono', 'SF Mono', 'monospace'],
        display: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
      },
      colors: {
        accent: {
          DEFAULT: '#22d3ee',
          foreground: '#050505',
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
        },
        surface: {
          DEFAULT: '#050505',
          50: '#0a0a0a',
          100: '#0f0f0f',
          200: '#1a1a1a',
        },
      },
      backdropBlur: {
        xs: '2px',
        '2xl': '40px',
        '3xl': '64px',
      },
      borderRadius: {
        '2rem': '2rem',
        '4xl': '2rem',
      },
      animation: {
        'breathe': 'breathe 3s ease-in-out infinite',
        'pulse-cyan': 'pulseCyan 2s ease-in-out infinite',
        'float': 'float 8s ease-in-out infinite',
        'float-delayed': 'float 8s ease-in-out 2s infinite',
        'typewriter': 'typewriter 3s steps(40) infinite',
        'grain': 'grain 8s steps(10) infinite',
        'reveal': 'reveal 0.8s cubic-bezier(0.32, 0.72, 0, 1) forwards',
        'slide-up': 'slideUp 0.8s cubic-bezier(0.32, 0.72, 0, 1) forwards',
        'orb-1': 'orb1 20s ease-in-out infinite',
        'orb-2': 'orb2 25s ease-in-out infinite',
        'orb-3': 'orb3 30s ease-in-out infinite',
      },
      keyframes: {
        breathe: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.5', transform: 'scale(0.95)' },
        },
        pulseCyan: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(34, 211, 238, 0.4)' },
          '50%': { boxShadow: '0 0 0 12px rgba(34, 211, 238, 0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '33%': { transform: 'translateY(-12px) rotate(1deg)' },
          '66%': { transform: 'translateY(-4px) rotate(-1deg)' },
        },
        grain: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '10%': { transform: 'translate(-5%, -10%)' },
          '20%': { transform: 'translate(-15%, 5%)' },
          '30%': { transform: 'translate(7%, -25%)' },
          '40%': { transform: 'translate(-5%, 25%)' },
          '50%': { transform: 'translate(-15%, 10%)' },
          '60%': { transform: 'translate(15%, 0%)' },
          '70%': { transform: 'translate(0%, 15%)' },
          '80%': { transform: 'translate(3%, 35%)' },
          '90%': { transform: 'translate(-10%, 10%)' },
        },
        reveal: {
          '0%': { opacity: '0', transform: 'translateY(24px)', clipPath: 'inset(0 0 100% 0)' },
          '100%': { opacity: '1', transform: 'translateY(0)', clipPath: 'inset(0 0 0% 0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
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
      },
    },
  },
  plugins: [],
};

export default config;
