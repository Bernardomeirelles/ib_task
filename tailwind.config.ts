import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'dark-bg': '#0a0e27',
        'dark-surface': '#1a1f3a',
        'dark-border': '#2a2f4a',
        'green-status': '#10b981',
        'yellow-status': '#f59e0b',
        'orange-status': '#f97316',
        'red-status': '#ef4444',
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
