import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Empty turbopack config to silence the warning
  turbopack: {},
  // Enable standalone output for Docker optimization
  output: 'standalone',
};

export default nextConfig;
