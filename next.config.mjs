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
  webpack: (config, { isServer }) => {
    // Ignore wasm.js file
    config.module.rules.push({
      test: /wasm\.js$/,
      use: 'null-loader',
    });
    return config;
  },
};

export default nextConfig; 