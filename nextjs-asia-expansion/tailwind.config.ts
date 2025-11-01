import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#E2231A',
          dark: '#C4161C',
        },
        secondary: {
          DEFAULT: '#767676',
          light: '#F4F4F4',
        },
      },
      screens: {
        'xs': '475px',
      },
    },
  },
  plugins: [],
};

export default config;

