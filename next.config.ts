import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['images.unsplash.com'],
    // unoptimized: process.env.NODE_ENV === 'development',
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  env: {
    REACT_APP_BASE_URL: process.env.REACT_APP_BASE_URL,
    REACT_APP_LOCAL_BASE_URL: process.env.REACT_APP_LOCAL_BASE_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  trailingSlash: false,
  reactStrictMode: true,
  poweredByHeader: false,
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  async redirects() {
    return [
      {
        source: '/payment-successful',
        destination: '/dashboard',
        permanent: false,
      },
      {
        source: '/payment-cancelled',
        destination: '/dashboard',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
