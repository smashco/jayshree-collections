import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/jayshree-collections',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
