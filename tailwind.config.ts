import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: { 900: '#101F3C', 800: '#16305C' },
        primary: { DEFAULT: '#24528C', dark: '#1B3E6E' },
        teal: { DEFAULT: '#4FC9BB', dark: '#37B0A2' },
        cream: '#F5EFE2',
        bg: '#F7F8FA',
        surface: '#FFFFFF',
        ink: '#1A1A1A',
        chip: '#6E7E8E',
      },
      borderRadius: { xl2: '1.25rem' },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
    },
  },
  plugins: [],
} satisfies Config
