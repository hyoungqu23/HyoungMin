import type { NextConfig } from 'next';

const config: NextConfig = {
  experimental: { typedRoutes: true },
  transpilePackages: ['@hyoungmin/ui', '@hyoungmin/schema'],
  images: { remotePatterns: [{ protocol: 'https', hostname: '*' }] },
};

export default config;

