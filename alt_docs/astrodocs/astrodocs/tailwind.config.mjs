/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
    './node_modules/@astrojs/starlight/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        // FaceSign brand colors
        facesign: {
          blue: '#2196f3',
          'blue-light': '#64b5f6',
          'blue-dark': '#0d47a1',
        },
        // Documentation specific colors
        docs: {
          link: '#2196f3',
          'link-hover': '#1976d2',
          code: '#e91e63',
          'code-bg': '#f5f5f5',
          'code-bg-dark': '#1e1e1e',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'Monaco', 'Andale Mono', 'Ubuntu Mono', 'monospace'],
      },
      typography: {
        DEFAULT: {
          css: {
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
            code: {
              fontWeight: '400',
              backgroundColor: 'var(--tw-prose-code-bg)',
              padding: '0.25rem 0.375rem',
              borderRadius: '0.25rem',
            },
            'a code': {
              color: 'inherit',
            },
          },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [
    // Add typography plugin support if needed for rich content
    // require('@tailwindcss/typography'),
  ],
} 