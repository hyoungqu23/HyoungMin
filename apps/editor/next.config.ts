import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";
const internalHost = process.env.TAURI_DEV_HOST || "localhost";

const nextConfig: NextConfig = {
  // Tauri requires static export
  output: "export",

  // Required for Next.js Image component in SSG mode
  images: {
    unoptimized: true,
  },

  // Configure assetPrefix for Tauri dev server
  assetPrefix: isProd ? undefined : `http://${internalHost}:3000`,

  // Transpile workspace packages
  transpilePackages: [
    "@hyoungmin/schema",
    "@hyoungmin/design-system",
    "@hyoungmin/ui",
  ],
};

export default nextConfig;
