// Env
// ---------------
export const baseUrl =
  process.env.NEXT_PUBLIC_APP_URL ??
  `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;

// Settings
// ---------------
export const pointsUpdateDate = '2023-06-01';

export const vendors = [
  { id: 'listfortress', name: 'Listfortress' },
  { id: 'longshanks', name: 'Longshanks' },
  { id: 'rollbetter', name: 'Rollbetter' },
];

// Navigation
// ---------------
export const siteNavigation = [
  {
    name: 'Analyze',
    href: '/analyze',
  },
  {
    name: 'Compositions',
    href: '/composition',
  },
];

export const secondaryNavigation = [
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
