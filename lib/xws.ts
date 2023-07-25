import type { XWSSquad, XWSUpgrades } from './types';
import SL_PILOTS from './data/standard-loadout-pilots.json';
import { getPointsByName } from './yasb';
import { getUpgradeName } from './get-value';

// LBN has some error and unnormalized in pilot ids.
const PILOT_ID_MAP = {
  'maulermither-battleofyavin': 'maulermithel-battleofyavin',
  'dt798-tiefofighter': 'dt798',
  'anakinskywalker-eta2actis-siegeofcoruscant':
    'anakinskywalker-siegeofcoruscant',
  'obiwankenobi-eta2actis-siegeofcoruscant': 'obiwankenobi-siegeofcoruscant',
  'kickback-sigeofcoruscant': 'kickback-siegeofcoruscant',
  'hondoohnaka-firesprayclasspatrolcraft': 'hondoohnaka',
  'bossk-z95': 'bossk-z95af4headhunter',
  'r2d2-ywing': 'r2d2',
  'anakinskywalker-ywing': 'anakinskywalker-btlbywing',
  'poedameron-2': 'poedameron-swz68',
  'tomaxbren-SWZ105': 'tomaxbren-swz105',
  'herasyndulla-bwing': 'herasyndulla-asf01bwing',
};

/**
 * Adjust some irregularities coming from LBN and Rollbetter.
 */
export const normalize = (xws: XWSSquad | null) => {
  if (!xws) {
    return xws;
  }

  const pilots = xws.pilots.map(pilot => {
    // Fix some weird IDs from LBN
    //@ts-expect-error (ID accessing allowed to fail)
    const pilotId = PILOT_ID_MAP[pilot.id];
    if (pilotId) {
      pilot = {
        ...pilot,
        id: pilotId,
      };
    }

    // Add loadout and costs to pilots with standard loadouts
    //@ts-expect-error (ID accessing allowed to fail)
    const props = SL_PILOTS[pilot.id];
    if (props) {
      pilot = {
        ...pilot,
        ...props,
      };
    }

    // LBN doesn't adhere XWS ...
    pilot.upgrades = pilot.upgrades || {};

    // LBN doesn't give the correct points costs
    if (!pilot.points) {
      pilot.points = getPointsByName(pilot.id);
    }

    return pilot;
  });

  return {
    ...xws,
    pilots,
  };
};

export const toXWS = (raw: string) => {
  try {
    return normalize(
      JSON.parse(raw.trim().replace(/\\'/g, "'").replace(/\\"/g, "'"))
    );
  } catch {
    throw new Error('[xws] Could not parse raw value...');
  }
};

export const getBuilderLink = (xws: XWSSquad | null) =>
  xws?.vendor?.yasb?.link ||
  // Remove `print` from lbn to show the builder instead
  xws?.vendor?.lbn?.link.replace('print', '') ||
  null;

export const upgradesToList = (upgrades: XWSUpgrades) =>
  (Object.entries(upgrades) as [keyof XWSUpgrades, string[]][])
    .map(([_, list]) => list.map(name => getUpgradeName(name) || name))
    .flat()
    .join(', ');

export const isStandardized = (pilot: string) => pilot in SL_PILOTS;
