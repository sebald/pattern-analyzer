// Security headers (from https://www.yagiz.co/securing-your-nextjs-13-application)
const ContentSecurityPolicy = `
  default-src 'self' vercel.live;
  script-src 'self' 'unsafe-eval' 'unsafe-inline' cdn.vercel-insights.com vercel.live https://www.google-analytics.com https://ssl.google-analytics.com https://www.googletagmanager.com;
  style-src 'self' 'unsafe-inline';
  img-src * blob: data:;
  media-src 'none';
  connect-src *;
  font-src 'self';
`.replace(/\n/g, '');

const securityHeaders = [
  { key: 'Content-Security-Policy', value: ContentSecurityPolicy },
  { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains; preload',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
];

/** @type {import('next').NextConfig} */
const config = {
  typescript: {
    // Needed to use cmkd from source...
    ignoreBuildErrors: true,
  },
  headers() {
    return [{ source: '/(.*)', headers: securityHeaders }];
  },
  redirects() {
    return [
      {
        source: '/event/:path*',
        destination: '/tournament/:path*',
        permanent: true,
      },
      {
        source: '/analyze',
        destination: '/insights',
        permanent: true,
      },
      {
        source: '/analyze/composition',
        destination: '/composition',
        permanent: true,
      },
      {
        source: '/analyze/composition/:id',
        destination: '/composition/:id',
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'infinitearenas.com',
        port: '',
        pathname: '/xw2/images/**',
      },
      {
        protocol: 'https',
        hostname: 'flagicons.lipis.dev',
        port: '',
        pathname: '/flags/4x3/**',
      },
    ],
  },
};

module.exports = config;
