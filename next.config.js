import { fileURLToPath } from 'node:url';

/** @type {import('next').NextConfig} */
const config = {
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

export default config;
