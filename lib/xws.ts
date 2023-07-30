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
  corranhornxwing: 'corranhorn-t65xwing',
  'bokatankryze-separatistalliance': 'bokatankryze',
  lukeskywalkerboy: 'lukeskywalker-battleofyavin',
  wampaboy: 'wampa-battleofyavin',
  durgeseparatist: 'durge-separatistalliance',
  dist81soc: 'dist81-siegeofcoruscant',
  dbs404soc: 'dbs404-siegeofcoruscant',
  dbs32csoc: 'dbs32c-siegeofcoruscant',
  bosskz95headhunter: 'bossk-z95af4headhunter',
  fennraurebelfang: 'fennrau-rebel-fang',
  wedgeantillesawing: 'wedgeantilles-rz1awing',
  darthvaderssp: 'darthvader-swz105',
  sabinewrentiefighter: 'sabinewren-tielnfighter',
  kylorentiewhisper: 'kyloren-tiewiwhispermodifiedinterceptor',
  poedameronyt1300: 'poedameron-scavengedyt1300',
  herasyndullaawing: 'herasyndulla-rz1awing',
  dalanoberosstarviper: 'dalanoberos-starviperclassattackplatform',
  vultskerristieinterceptor: 'vultskerris-tieininterceptor',
  garvendreisboy: 'garvendreis-battleofyavin',
  jekporkinsboy: 'jekporkins-battleofyavin',
  oddballywing: 'oddball-btlbywing',
  anakinskywalkerywing: 'anakinskywalker-btlbywing',
  darkcurseboy: 'darkcurse-battleofyavin',
  countdookusoc: 'countdooku-siegeofcoruscant',
  darthvaderboy: 'darthvader-battleofyavin',
  maulermithelboy: 'maulermithel-battleofyavin',
  hansoloboy: 'hansolo-battleofyavin',
  holokandboy: 'holokand-battleofyavin',
  darthvadertiedefender: 'darthvader-tieddefender',
  wedgeantillesboy: 'wedgeantilles-battleofyavin',
  // These ones are really dumb ...
  'hansolo-rebelalliance': 'hansolo-modifiedyt1300lightfreighter',
  'durge-separatistalliance': 'durge-separatistalliance',
};

/**
 * Adjust some irregularities coming from LBN and Rollbetter.
 */
export const normalize = (xws: XWSSquad | null) => {
  if (!xws) {
    return xws;
  }

  const pilots = xws.pilots.map(pilot => {
    // Fix some broken IDs from builders that don't follow XWS
    const pilotId =
      //@ts-expect-error (ID accessing allowed to fail)
      PILOT_ID_MAP[pilot.id] || PILOT_ID_MAP[`${pilot.id}-${xws.faction}`];

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
