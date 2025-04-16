/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
    unoptimized: process.env.NODE_ENV === 'production',
  },
  // Enable static exports
  output: 'export',
  // Disable image optimization in production
  images: {
    unoptimized: true
  }
};

export default nextConfig; 