import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      borderWidth: {
        '12': '12px',
        '16': '16px',
      },
      width: {
        '100': '25rem',
        '120': '30rem',
        '160': '40rem',
        '200': '50rem',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
export default config;
