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
    name: 'Tournaments',
    href: '/tournament',
  },
  {
    name: 'Insights',
    href: '/insights',
  },
  {
    name: 'Compositions',
    href: '/composition',
  },
  {
    name: 'Pilots',
    href: '/pilot',
  },
  {
    name: 'Upgrades',
    href: '/upgrade',
  },
];

export const secondaryNavigation = [
  {
    name: 'About',
    href: '/about',
  },
  {
    name: 'GitHub',
    href: 'https://github.com/sebald/pattern-analyzer',
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
