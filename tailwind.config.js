/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,vue}'],
  theme: {
    fontSize: {
      sm: '12px',
      base: '14px',
      lg: '18px',
      xl: '1.5rem',
      '2xl': '2rem'
    },
    colors: {
      primary: 'var(--color-primary)',
      primary_bg: 'var(--color-primary-bg)',
      success: 'var(--color-success)',
      error: 'var(--color-error)',
      warning: 'var(--color-warning)',
      link: 'var(--color-link)',
      black: '#000',
      white: '#fff',
      CDE: 'var(--color-CDE)',
      C82: 'var(--color-C82)',
      blue: 'var(--color-blue)',
      blue_light: 'var(--color-blue-light)',
      item_hover: 'var(--color-item-hover)',
      canvas: 'var(--color-canvas)',
      sidebar: 'var(--color-sidebar)',
      sidebar_soft: 'var(--color-sidebar-soft)',
      sidebar_border: 'var(--color-sidebar-border)',
      sidebar_text: 'var(--color-sidebar-text)',
      tag: 'var(--color-tag)'
    },
    extend: {
      boxShadow: {
        '3xl': '1px 1px 8px 0px #DEDEDE'
      }
    }
  },
  plugins: []
}
