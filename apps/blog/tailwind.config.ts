import type { Config } from 'tailwindcss';

export default {
  content: [
    './src/**/*.{ts,tsx,mdx}',
    './contents/**/*.mdx',
    '../../packages/ui/src/**/*.{ts,tsx}',
  ],
  plugins: [require('@tailwindcss/typography')],
} satisfies Config;

