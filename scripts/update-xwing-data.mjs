#!/usr/bin/env zx
import 'zx/globals';

/**
 * Script to transform `xwing-data2` into a more convenient format.
 * Only required data is gathered and flatten before writting to a JSON file.
 */
const PROJECT_ROOT = path.resolve(__dirname, '..');
const TARGET = path.join(PROJECT_ROOT, 'lib/data');

// Small helper to read in data
const XWING_DATA_ROOT = path.resolve(PROJECT_ROOT, 'node_modules/xwing-data2');
const read = file => fs.readJsonSync(path.resolve(XWING_DATA_ROOT, file));

// The manifest contains relative file paths to all JSON files.
const manifest = read('data/manifest.json');

// Faction Data
// ---------------

const PILOT_SUFFIX = {
  // Ships / Configs
  delta7baethersprite: '7b',
  'oddball-arc170starfighter': 'ARC-170',
  'oddball-btlbywing': 'Y-Wing',
  'oddball-nimbusclassvwing': 'V-Wing',

  // Ids (needed because Mauler and Temmin have the same caption ...)
  'poedameron-swz68': 'HoH',
  'temminwexley-swz68': 'HoH',

  // Szenarios
  'Siege of Coruscant': 'SoC',
  'Battle of Yavin': 'BoY',
};

const UPGRADE_SUFFIX = {
  // Slot
  gunner: '(Gunner)',
  crew: '(Crew)',

  // Faction
  republic: '(Republic)',
  resistance: '(Resistance)',
  'crew-swz19': '(Resistance)',
  scum: '(Scum)',
  'rebel-scum': '(Rebel/Scum)',
  swz82: '(Scum/CIS)',

  // Scenario
  siegeofcoruscant: '(SoC)',
  battleofyavin: '(BoY)',
};

/**
 * Additional upgrades that are not listed in x-wing-data2 because
 * they are part of a standard loadout.
 */
const EXTRA_UPGRADES = {
  attackspeed: 'Attack Speed',
  r5k6: 'R5-K6',
  vengeful: 'Vengeful',
  vectoredcannons: 'Vectored Cannons',
};

/**
 * Only take certain properties from pilot and
 * append scenario abbreviation to name if applicable.
 */
const parsePilots = (pilots, ship) =>
  pilots.reduce((o, pilot) => {
    const { xws: id, name, caption, standardLoadout, cost } = pilot;

    o[id] = {
      id,
      name:
        PILOT_SUFFIX[id] || PILOT_SUFFIX[ship] || PILOT_SUFFIX[caption]
          ? `${name} (${
              PILOT_SUFFIX[id] || PILOT_SUFFIX[ship] || PILOT_SUFFIX[caption]
            })`
          : name,
      caption,
      cost,
    };

    if (standardLoadout) {
      o[id].standardLoadout = standardLoadout;
    }

    return o;
  }, {});

/**
 * Transforms data to `<faction id>.<ship id>.pilots.<pilot id>`,
 * where the id is the corresponding XWS key.
 */
const getShipsByFaction = faction => {
  const ships = manifest.pilots.find(item => item.faction === faction).ships;
  return ships.reduce((o, ship) => {
    const { xws: id, name, icon, pilots } = read(ship);
    o[id] = {
      id,
      name,
      icon,
      pilots: parsePilots(pilots, id),
    };
    return o;
  }, {});
};

const factions = read(manifest.factions[0]).reduce(
  (o, { xws: id, name, icon }) => {
    o[id] = {
      id,
      name,
      icon,
      ships: getShipsByFaction(id),
    };

    return o;
  },
  {}
);

// Upgrades
// ---------------
/**
 * Only take certain properties from upgrades and
 * transform them to a map.
 */
const parseUpgrades = upgrades =>
  upgrades.reduce((o, { xws: id, name }) => {
    o[id] = { id, name };
    return o;
  }, {});

const upgrades = manifest.upgrades.reduce((o, file) => {
  const upgrades = read(file);
  const type = path.parse(file).name;

  o[type] = parseUpgrades(upgrades);

  return o;
}, {});

// Output to File
// ---------------

/**
 * ℹ️ We do not use most of the xwing data to reduce bundle size.
 *   If we ever want to parse XWS data we might need it again.
 */

// await fs.outputJson(
//   `${TARGET}/xwing-data2.json`,
//   { factions, upgrades },
//   { spaces: 2 }
// );

// Display Values
// ---------------
const display = {
  faction: {},
  ship: {},
  pilot: {},
  upgrades: {},
};

// Normalization
// ---------------
const getUpgradeType = id => {
  for (const type in upgrades) {
    if (upgrades[type][id]) {
      return type;
    }
  }
  return 'unknown';
};

/**
 * Pilots from scenarios don't have upgrades in LBN and sometimes
 * their cost is missing too...
 */
const normalization = {};

read(manifest.factions[0]).forEach(({ xws: factionId, name, icon }) => {
  display.faction[factionId] = {
    name,
    icon,
  };

  Object.values(factions[factionId].ships).forEach(ship => {
    display.ship[ship.id] = ship.name;

    Object.values(ship.pilots).forEach(pilot => {
      display.pilot[pilot.id] = pilot.name;

      if (pilot.standardLoadout) {
        normalization[pilot.id] = {
          points: pilot.cost,
          upgrades: pilot.standardLoadout.reduce((o, up) => {
            const type = getUpgradeType(up);
            const list = o[type] || [];

            list.push(up);
            o[type] = list;

            return o;
          }, {}),
        };
      }
    });
  });

  Object.values(upgrades).forEach(type => {
    Object.values(type).forEach(item => {
      const addon = item.id.split('-')[1];
      const suffix = addon ? UPGRADE_SUFFIX[addon] : '';

      display.upgrades[item.id] = suffix ? `${item.name} ${suffix}` : item.name;
    });
  });

  Object.entries(EXTRA_UPGRADES).forEach(([id, name]) => {
    display.upgrades[id] = name;
  });
});

await fs.outputJson(`${TARGET}/display-values.json`, display, { spaces: 2 });
await fs.outputJson(`${TARGET}/standard-loadout-pilots.json`, normalization, {
  spaces: 2,
});
