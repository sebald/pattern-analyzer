export const baseUrl =
  process.env.NEXT_PUBLIC_APP_URL ??
  `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;

export const pointsUpdateDate = '2023-06-01';

export const siteNavigation = [
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

export const xWingResources = [
  {
    name: 'Listfortess',
    href: 'https://listfortress.com/',
  },
  {
    name: 'MetaWing',
    href: 'https://meta.listfortress.com/',
  },
  {
    name: 'Pink Brain Matter',
    href: 'https://pinksquadron.dk/pbm/',
  },
  {
    name: 'Advanced Targeting Computer',
    href: 'http://advancedtargeting.computer/',
  },
];
