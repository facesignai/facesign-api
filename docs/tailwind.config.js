import typographyPlugin from '@tailwindcss/typography'
import typography from './typography'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx,mdx}'],
  darkMode: 'class',
  plugins: [typographyPlugin],
  ...typography,
}