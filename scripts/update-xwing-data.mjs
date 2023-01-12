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

const SCENARIOS = {
  'Siege of Coruscant': 'SoC',
  'Battle of Yavin': 'BoY',
};

/**
 * Only take certain properties from pilot and
 * append scenario abbreviation to name if applicable.
 */
const parsePilots = pilots =>
  pilots.reduce((o, pilot) => {
    const { xws: id, name, caption } = pilot;
    o[id] = {
      id,
      name: SCENARIOS[caption] ? `${name} (${SCENARIOS[caption]})` : name,
      caption,
    };

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
      pilots: parsePilots(pilots),
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
await fs.outputJson(`${TARGET}/factions.json`, factions, { spaces: 2 });

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

await fs.outputJson(`${TARGET}/upgrades.json`, upgrades, { spaces: 2 });
