import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/jayshree-collections',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
