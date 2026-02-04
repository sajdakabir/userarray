import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
  staticPageGenerationTimeout: 120,
};

export default nextConfig;
