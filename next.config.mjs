/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  output: 'standalone',
  turbopack: {},
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