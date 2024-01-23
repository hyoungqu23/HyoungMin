import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    screens: {
      mobile: '640px',
      tablet: '768px',
      laptop: '1280px',
      desktop: '1920px',
    },
    extend: {
      fontSize: {
        display1: ['6.5rem', { lineHeight: '7rem', letterSpacing: '-2%' }],
        display2: ['5.5rem', { lineHeight: '6rem', letterSpacing: '-2%' }],
        display3: ['4.75rem', { lineHeight: '5.5rem', letterSpacing: '-2%' }],
        heading1: ['4rem', { lineHeight: '4.5rem', letterSpacing: '-1%' }],
        heading2: ['3.25rem', { lineHeight: '4rem', letterSpacing: '-1%' }],
        heading3: ['2.75rem', { lineHeight: '3.5rem', letterSpacing: '-1%' }],
        heading4: ['2rem', { lineHeight: '2.5rem', letterSpacing: '-1%' }],
        heading5: ['1.625rem', { lineHeight: '2.5rem', letterSpacing: '-1%' }],
        heading6: ['1.25rem', { lineHeight: '2rem', letterSpacing: '-1%' }],
        body1: ['1.125rem', { lineHeight: '1.75rem' }],
        body2: ['1rem', { lineHeight: '1.5rem' }],
        body3: ['0.875rem', { lineHeight: '1.5rem' }],
        caption1: ['0.75rem', { lineHeight: '1rem' }],
        caption2: ['0.625rem', { lineHeight: '1rem' }],
      },
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
      keyframes: {
        'automatic-infinite-carousel': {
          from: { left: '0' },
          to: { left: '-100%' },
        },
      },
      animation: {
        'automatic-infinite-carousel':
          'automatic-infinite-carousel 60s linear infinite',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

export default config;
