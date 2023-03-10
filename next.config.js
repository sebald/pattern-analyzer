/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'squadbuilder.fantasyflightgames.com',
        port: '',
        pathname: '/ship_types/**',
      },
      {
        protocol: 'https',
        hostname: 'squadbuilder.fantasyflightgames.com',
        port: '',
        pathname: '/factions/**',
      },
    ],
  },
};

module.exports = nextConfig;
