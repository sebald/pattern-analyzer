export const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL ??
  `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;

export const POINTS_UPDATE_DATE = '2023-06-01';

export const SITE_NAVIGATION = [
  {
    name: 'Home',
    href: '/',
  },
  {
    name: 'Analyze',
    href: '/analyze',
  },
  {
    name: 'About',
    href: '/about',
  },
];
