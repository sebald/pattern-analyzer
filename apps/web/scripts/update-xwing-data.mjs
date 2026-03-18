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
const parsePilots = pilots =>
  pilots.reduce((o, pilot) => {
    const { xws: id, standardLoadout, cost, standard } = pilot;

    o[id] = {
      id,
      cost,
      standard,
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
      pilots: parsePilots(pilots, id, faction),
    };
    return o;
  }, {});
};

const factions = read(manifest.factions[0]).reduce((o, { xws: id }) => {
  o[id] = {
    id,
    ships: getShipsByFaction(id),
  };

  return o;
}, {});

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
 * their cost is missing too. We store this information to normalize XWS.
 */
const normalization = {};

// Standard Legal
// ---------------
const ships = {};

read(manifest.factions[0]).forEach(({ xws: factionId }) => {
  ships[factionId] = {
    ships: [],
  };

  Object.values(factions[factionId].ships).forEach(ship => {
    Object.values(ship.pilots).forEach(pilot => {
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

      if (pilot.standard && !ships[factionId].ships.includes(ship.id)) {
        ships[factionId].ships.push(ship.id);
      }
    });
  });
});

await fs.outputJson(`${TARGET}/standard-loadout-pilots.json`, normalization, {
  spaces: 2,
});
await fs.outputJson(`${TARGET}/standard-ships.json`, ships, {
  spaces: 2,
});
