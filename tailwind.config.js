/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        serif: ['Georgia', 'Garamond', 'Times New Roman', 'serif'],
        display: ['Trebuchet MS', 'Lucida Grande', 'Verdana', 'sans-serif'],
        mono: ['Monaco', 'Courier New', 'Courier', 'monospace'],
        casual: ['Segoe Print', 'Comic Sans MS', 'Courier New', 'monospace'],
        elegant: ['Palatino Linotype', 'Book Antiqua', 'Palatino', 'Times New Roman', 'serif'],
        modern: ['Segoe UI', 'Tahoma', 'Geneva', 'Verdana', 'sans-serif'],
        classic: ['Times New Roman', 'Times', 'serif'],
      },
      colors: {
        primary: '#6366f1',
        secondary: '#8b5cf6',
        cozy: {
          dark: '#2d1b3d',
          light: '#f5e6d3',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in',
        'slide-in': 'slideIn 0.3s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}
