import type { NextConfig } from 'next';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'https://iftype.store';

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${API_URL}/:path*`,
      },
    ];
  },
};

export default nextConfig;
