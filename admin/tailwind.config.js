/**
 * Mirrors the client site's Tailwind theme (../tailwind.config.js) so the
 * admin shares the exact same design tokens — ink canvas, beam accent,
 * glass radii, glows and motion curves.
 */

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    container: { center: true, padding: '1rem', screens: { '2xl': '1200px' } },
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: { DEFAULT: 'hsl(var(--card))', foreground: 'hsl(var(--card-foreground))' },
        popover: { DEFAULT: 'hsl(var(--popover))', foreground: 'hsl(var(--popover-foreground))' },
        primary: { DEFAULT: 'hsl(var(--primary))', foreground: 'hsl(var(--primary-foreground))' },
        secondary: { DEFAULT: 'hsl(var(--secondary))', foreground: 'hsl(var(--secondary-foreground))' },
        muted: { DEFAULT: 'hsl(var(--muted))', foreground: 'hsl(var(--muted-foreground))' },
        accent: { DEFAULT: 'hsl(var(--accent))', foreground: 'hsl(var(--accent-foreground))' },
        destructive: { DEFAULT: 'hsl(var(--destructive))', foreground: 'hsl(var(--destructive-foreground))' },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        // Literal brand tokens
        ink: { 900: '#0a0305', 800: '#120406', 700: '#2a0709', 600: '#1c0a0c' },
        beam: { DEFAULT: '#ff4d5e', hover: '#ff6675', hot: '#ff97a1' },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 4px)',
        sm: 'calc(var(--radius) - 8px)',
        glass: '18px',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 24px rgba(255, 77, 94, 0.32)',
        'glow-lg': '0 0 60px rgba(255, 77, 94, 0.40)',
        card: '0 18px 50px -20px rgba(0, 0, 0, 0.6)',
      },
      backgroundImage: {
        'accent-grad': 'linear-gradient(135deg, #ff4d5e 0%, #ff6675 100%)',
        grid: 'linear-gradient(rgba(255,77,94,.055) 1px, transparent 1px), linear-gradient(90deg, rgba(255,77,94,.055) 1px, transparent 1px)',
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(18px)' },
          to: { opacity: '1', transform: 'none' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          from: { backgroundPosition: '0% 50%' },
          to: { backgroundPosition: '200% 50%' },
        },
        'dropdown-in': {
          from: { opacity: '0', transform: 'translateY(-8px) scale(.985)' },
          to: { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.7s cubic-bezier(0.2, 0.7, 0.2, 1) both',
        float: 'float 6s ease-in-out infinite',
        shimmer: 'shimmer 5s linear infinite',
        'dropdown-in': 'dropdown-in 0.26s cubic-bezier(0.2, 0.7, 0.2, 1) both',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
