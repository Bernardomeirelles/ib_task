/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bloomberg: {
          dark: '#0f172a',
          darker: '#0a0e27',
          bg: '#1e293b',
          border: '#334155',
          text: '#e2e8f0',
          muted: '#64748b',
        },
      },
      fontFamily: {
        mono: ['"IBM Plex Mono"', '"Monaco"', '"Courier New"', 'monospace'],
      },
      fontSize: {
        'terminal-sm': ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.05em' }],
        'terminal-xs': ['0.625rem', { lineHeight: '0.875rem', letterSpacing: '0.05em' }],
      },
      keyframes: {
        'pulse-critical': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
      },
      animation: {
        'pulse-critical': 'pulse-critical 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: true,
  },
}
