/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      // Official US flag colors as primary palette
      colors: {
        flag: {
          red: '#B31942',
          blue: '#0A3161',
          white: '#FFFFFF',
        },
        // Truth score colors mapped to rating labels
        score: {
          false: '#DC2626',
          misleading: '#EA580C',
          mixed: '#CA8A04',
          'mostly-true': '#16A34A',
          true: '#059669',
        },
      },
      // Serif headlines, sans-serif body — newspaper aesthetic
      fontFamily: {
        headline: ['Georgia', 'Playfair Display', 'Times New Roman', 'serif'],
        body: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Inter', 'sans-serif'],
        mono: ['SF Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
};
