/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
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
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
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
        indigo: {
          50: '#fdf2f2',
          100: '#fde5e6',
          200: '#fcc5c7',
          300: '#f99da1',
          400: '#f56268',
          500: '#E11827',
          600: '#E11827',
          700: '#910814',
          800: '#750610',
          900: '#52030a',
          950: '#330206',
        },
        violet: {
          50: '#fdf2f2',
          100: '#fde5e6',
          200: '#fcc5c7',
          300: '#f99da1',
          400: '#f56268',
          500: '#E11827',
          600: '#910814',
          700: '#750610',
          800: '#52030a',
          900: '#330206',
          950: '#1a0103',
        },
        shadows: {
          black: '#08080A',
          surface: '#111114',
          surface2: '#16161B',
          red: '#E11827',
          crimson: '#910814',
          white: '#F7F5F5',
          grey: '#AFAAAF',
        },
      },
      boxShadow: {
        glow: '0 0 20px rgba(225, 24, 39, 0.3)',
        'glow-lg': '0 0 35px rgba(225, 24, 39, 0.5)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}


