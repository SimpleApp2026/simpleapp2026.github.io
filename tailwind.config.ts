import type { Config } from 'tailwindcss'

// Paleta oficial del Figma "+Simple TIF" (Código de colores):
//   #ffffff  blanco (fondos/superficies)
//   #6d777a  gris (texto secundario, chips)
//   #8fded3  turquesa (acento)
//   #16154c  azul profundo (headers, botones primarios)
//   #1c3243  azul pizarra (texto, botones secundarios)
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: { 900: '#16154C', 800: '#1C3243' },
        primary: { DEFAULT: '#16154C', dark: '#1C3243' },
        teal: { DEFAULT: '#8FDED3', dark: '#6FC9BC' },
        cream: '#F5EFE2',
        bg: '#FFFFFF',
        surface: '#FFFFFF',
        ink: '#1C3243',
        chip: '#6D777A',
      },
      borderRadius: { xl2: '1.25rem' },
      // Tipografía oficial del Figma: Helvética World y FS Aldrin.
      // Son fuentes comerciales sin archivo provisto: se referencian primero
      // (se usan si están instaladas) con fallback métrico Helvetica/Arial y
      // la Inter empaquetada como último recurso offline.
      fontFamily: {
        sans: ['Helvetica World', 'Helvetica Neue', 'Helvetica', 'Arial', 'Inter', 'system-ui', 'sans-serif'],
        display: ['FS Aldrin', 'Helvetica World', 'Helvetica Neue', 'Arial', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config
