/** @type {import('next').NextConfig} */

const withPWA = require('next-pwa')({
  dest: 'public', // where to put service worker
  register: true,
  skipWaiting: true,
});


const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  webpack: (config, { isServer }) => {
    config.cache = false;
    return config;
  },
};

module.exports = withPWA(nextConfig);