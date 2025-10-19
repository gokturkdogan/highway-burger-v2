import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: '#FFB703',
          foreground: '#000000',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['var(--font-inter)'],
        display: ['Poppins', 'var(--font-inter)'],
        heading: ['Montserrat', 'var(--font-inter)'],
      },
      animation: {
        'border-pulse': 'border-pulse 2s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'fadeIn': 'fadeIn 0.6s ease-out',
        'slideUp': 'slideUp 0.6s ease-out',
        'cartFloat': 'cartFloat 3s ease-in-out infinite',
        'buttonGlow': 'buttonGlow 1.5s ease-in-out infinite',
        'activeGlow': 'activeGlow 2.5s ease-in-out infinite',
        'shimmer': 'shimmer 3s ease-in-out infinite',
      },
      keyframes: {
        'border-pulse': {
          '0%, 100%': { width: '0%', opacity: '0' },
          '50%': { width: '100%', opacity: '1' },
        },
        'glow': {
          '0%': { boxShadow: '0 0 2px #bb7c05, 0 0 4px #bb7c05' },
          '100%': { boxShadow: '0 0 4px #bb7c05, 0 0 8px #bb7c05' },
        },
        'fadeIn': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slideUp': {
          'from': { transform: 'translateY(100%)', opacity: '0' },
          'to': { transform: 'translateY(0)', opacity: '1' },
        },
        'cartFloat': {
          '0%, 100%': { transform: 'translateX(-50%) translateY(0)' },
          '50%': { transform: 'translateX(-50%) translateY(-4px)' },
        },
        'buttonGlow': {
          '0%, 100%': { filter: 'brightness(1)' },
          '50%': { filter: 'brightness(1.1)' },
        },
        'activeGlow': {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 10px rgba(187, 124, 5, 0.5)' },
          '50%': { opacity: '0.75', boxShadow: '0 0 20px rgba(187, 124, 5, 0.7)' },
        },
        'shimmer': {
          '0%': { opacity: '0.3', transform: 'translateX(-100%)' },
          '50%': { opacity: '1' },
          '100%': { opacity: '0.3', transform: 'translateX(100%)' },
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
export default config

