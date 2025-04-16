/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'res.cloudinary.com'],
    unoptimized: true,
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
};

export default nextConfig; 