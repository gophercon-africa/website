/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'res.cloudinary.com'],
    // unoptimized: process.env.NODE_ENV === 'development',
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com/',
        port: '',
        pathname: '/**',
        search: '',
      },
    ],
  },
  output: 'standalone',
  // Disable image optimization completely
  experimental: {
    images: {
      unoptimized: true
    }
  }
};

export default nextConfig; 