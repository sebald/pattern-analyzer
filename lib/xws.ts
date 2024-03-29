import type {
  XWSFaction,
  XWSSquad,
  XWSUpgradeSlots,
  XWSUpgrades,
} from './types';
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
  poedameronhoh: 'poedameron-swz68',
  'tomaxbren-SWZ105': 'tomaxbren-swz105',
  'herasyndulla-bwing': 'herasyndulla-asf01bwing',
  corranhornxwing: 'corranhorn-t65xwing',
  'bokatankryze-separatistalliance': 'bokatankryze',
  durgeseparatist: 'durge-separatistalliance',
  bosskz95headhunter: 'bossk-z95af4headhunter',
  fennraurebelfang: 'fennrau-fangfighter',
  'fennrau-rebel-fang': 'fennrau-fangfighter',
  wedgeantillesawing: 'wedgeantilles-rz1awing',
  darthvaderssp: 'darthvader-swz105',
  sabinewrentiefighter: 'sabinewren-tielnfighter',
  kylorentiewhisper: 'kyloren-tiewiwhispermodifiedinterceptor',
  poedameronyt1300: 'poedameron-scavengedyt1300',
  herasyndullaawing: 'herasyndulla-rz1awing',
  dalanoberosstarviper: 'dalanoberos-starviperclassattackplatform',
  vultskerristieinterceptor: 'vultskerris-tieininterceptor',
  oddballywing: 'oddball-btlbywing',
  oddballarc170: 'oddball-arc170starfighter',
  anakinskywalkerywing: 'anakinskywalker-btlbywing',
  darthvadertiedefender: 'darthvader-tieddefender',
  landocalrissianresistance: 'landocalrissian-scavengedyt1300',
  gideonhaskxishuttle: 'gideonhask-xiclasslightshuttle',
  sabinewrenawing: 'sabinewren-rz1awing',
  ezrabridgergauntletfighter: 'ezrabridger-gauntletfighter',
  herasyndullabwing: 'herasyndulla-asf01bwing',
  garvendreisxwing: 'garvendreis-t65xwing',
  gideonhasktieinterceptor: 'gideonhask-tieininterceptor',
  anakinskywalkerdelta7b: 'anakinskywalker-delta7baethersprite',
  chewbaccaresistance: 'chewbacca-scavengedyt1300',
  macewindudelta7b: 'macewindu-delta7baethersprite',
  ahsokatanoawing: 'ahsokatano-rz1awing',
  l337escapecraft: 'l337-escapecraft',
  nomlumbrogue: 'nomlumb-rogueclassstarfighter',
  // These ones are really dumb ...
  'hansolo-rebelalliance': 'hansolo-modifiedyt1300lightfreighter',
  'durge-separatistalliance': 'durge-separatistalliance',
};

const UPGRADE_ID_MAP = {
  r2d2resistance: 'r2d2-resistance',
  choppercrew: 'chopper-crew',
};

export const parsePilotId = (val: string, faction: XWSFaction) => {
  let pilot = val
    // Scenarios
    .replace(/boy$/, '-battleofyavin')
    .replace(/soc$/, '-siegeofcoruscant')
    // Factions
    .replace(/separatist$/, '-separatistalliance');

  return (
    //@ts-expect-error (ID accessing allowed to fail)
    PILOT_ID_MAP[val] ??
    //@ts-expect-error (ID accessing allowed to fail)
    PILOT_ID_MAP[`${val}-${faction}`] ??
    pilot
  );
};

/**
 * Adjust some irregularities coming from LBN and Rollbetter.
 */
export const normalize = (xws: XWSSquad | null): XWSSquad | null => {
  if (!xws) {
    return xws;
  }

  const pilots = xws.pilots.map(pilot => {
    pilot = {
      ...pilot,
      id: parsePilotId(pilot.id, xws.faction),
    };

    // Add loadout and costs to pilots with standard loadouts
    //@ts-expect-error (ID accessing allowed to fail)
    const props = SL_PILOTS[pilot.id];
    if (props) {
      pilot = {
        ...pilot,
        ...props,
      };
    }

    // Fix upgrade IDs...
    pilot.upgrades = pilot.upgrades || {};
    Object.keys(pilot.upgrades).forEach(slot => {
      const current = pilot.upgrades[slot as XWSUpgradeSlots];
      if (current) {
        pilot.upgrades[slot as XWSUpgradeSlots] = current.map(
          //@ts-expect-error (ID accessing allowed to fail)
          upgrade => UPGRADE_ID_MAP[upgrade] ?? upgrade
        );
      }
    });

    // LBN doesn't give the correct points costs
    if (!pilot.points || pilot.points === 100) {
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
  // Cleanup not-JSON stuff
  let val = raw.trim().replace(/\\'/g, "'").replace(/\\"/g, "'");

  // People put stuff in the list names that is not JSON-friendly
  val = val.replace(/'name':'([^,]*),/, match => {
    match = match
      .replace("'link':'", '')
      .replace(/',$/, '')
      .replace(/'/g, "\\'");

    return `"link":"${match}",`;
  });

  // LBN doesn't really have regular JSON?
  if (val.includes("'link':'https://launchbaynext.app/print")) {
    val = val
      // Correctly URL encode
      .replace(/'link':'([^,]*),/, match => {
        match = match
          .replace("'link':'", '')
          .replace(/',$/, '')
          .replace(/'/g, '%27');

        return `"link":"${match}",`;
      })
      // Convert all ' to " so JSON.parse works
      .replace(/'/g, '"');
  }

  try {
    return normalize(JSON.parse(val));
  } catch {
    throw new Error('[xws] Could not parse raw value...');
  }
};

export const getPilots = (xws: XWSSquad) => xws.pilots.map(pilot => pilot.id);

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

export const toCompositionId = (xws: XWSSquad) => {
  const id = xws.pilots.map(pilot => pilot.ship);
  id.sort();

  return id.join('.');
};
