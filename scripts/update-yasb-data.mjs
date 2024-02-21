#!/usr/bin/env zx
import 'zx/globals';

const PROJECT_ROOT = path.resolve(__dirname, '..');
const DATA_FOLDER = path.join(PROJECT_ROOT, 'lib/data');
const FONT_FOLDER = path.join(PROJECT_ROOT, 'app/fonts');

const YASB_FILE_PATH = path.resolve(__dirname, 'yasb.tmp.js');

/**
 * Helper from yasb.ts (to lazy to compile and use them directly...)
 */
const canonicalize = val =>
  val
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .replace(/\s+/g, '-');

const toPilotId = pilot => {
  // console.log(pilot);
  const [name, suffix] = pilot.name.split(/[()]/);

  return pilot.xws != null
    ? pilot.xws
    : pilot.xwsaddon != null
      ? canonicalize(name) + '-' + pilot.xwsaddon
      : canonicalize(name) +
        (suffix != null ? '-' + canonicalize(pilot.ship) : '');
};

const toUpgradeId = upgrade => {
  const [name, suffix] = upgrade.name.split(/[()]/);

  return upgrade.xws != null
    ? upgrade.xws
    : upgrade.xwsaddon != null
      ? canonicalize(name) + '-' + upgrade.xwsaddon
      : canonicalize(name) +
        (suffix != null ? '-' + canonicalize(upgrade.slot || '') : '');
};

/**
 * Get YASB data from the source file
 */
const res = await fetch('https://yasb.app/javascripts/xwingcontent.min.js');
const contents = await res.text();
await fs.outputFile(YASB_FILE_PATH, contents);

const data = require(YASB_FILE_PATH).basicCardData();

const pilots = data.pilotsById
  // YASB skips some IDs?
  .filter(({ skip }) => !skip)
  .map(({ id, name, ship, points, skill, xws, xwsaddon }) => ({
    id,
    name,
    ship,
    points,
    skill,
    xws,
    xwsaddon,
  }));

const upgrades = data.upgradesById
  // YASB skips some IDs?
  .filter(({ skip }) => !skip)
  .map(({ id, name, slot, xws, xwsaddon }) => ({
    id,
    name,
    slot,
    xws,
    xwsaddon,
  }));

await fs.outputJson(
  `${DATA_FOLDER}/yasb.json`,
  {
    pilots,
    upgrades,
  },
  { spaces: 2 }
);

/**
 * Use YASB data to generate display values
 */
const display = {
  faction: {
    rebelalliance: 'Rebel Alliance',
    galacticempire: 'Galactic Empire',
    scumandvillainy: 'Scum and Villainy',
    resistance: 'Resistance',
    firstorder: 'First Order',
    galacticrepublic: 'Galactic Republic',
    separatistalliance: 'Separatist Alliance',
  },
  ship: Object.fromEntries(
    Object.keys(data.ships).map(ship => [canonicalize(ship), ship])
  ),
  pilot: Object.fromEntries(
    pilots.map(pilot => [toPilotId(pilot), pilot.name])
  ),
  upgrades: Object.fromEntries(
    upgrades.map(upgrade => [toUpgradeId(upgrade), upgrade.name])
  ),
};

// const ships = Object.keys(data.ships).map(ship => [canonicalize(ship), ship]);
// ships.sort(([a], [b]) => a.localeCompare(b));
// data.ships = Object.fromEntries(ships);

const p = pilots.map(pilot => [toPilotId(pilot), pilot.name]);
p.sort(([a], [b]) => a.localeCompare(b));
display.pilot = Object.fromEntries(p);

await fs.outputJson(`${DATA_FOLDER}/display-values.json`, display, {
  spaces: 2,
});

// Remove downloaded yasb file
await fs.remove(YASB_FILE_PATH);

/**
 * Copy X-Wing fonts and data from raithos/xwing repo since
 * they are the most up to date I can find ...
 */

const SHIP_FONT_FILE = path.join(
  PROJECT_ROOT,
  'node_modules/yasb/fonts/xwing-miniatures-ships.ttf'
);
$`cp ${SHIP_FONT_FILE} ${FONT_FOLDER}`;

const css = await fs.readFile(
  path.join(PROJECT_ROOT, 'node_modules/yasb/fonts/xwing-miniatures.css'),
  'utf8'
);

const shipIcons = {};
const matches = css.matchAll(
  /**
   * Matches CSS rules that are usually used to apply the correct icon
   * based on a given class (xwing-miniatures-ship-<id>). We use these classes
   * to generate a JSON. Use the "id" as key and the "value", which is the
   * "content" CSS property in the original file, as value. This pair can then
   * be used inside our component to render an icon based on a given ship id.
   */
  /xwing-miniatures-ship-(?<id>.+?(?=:))(.*)\n(.+?(?="))"(?<value>.+)"/gm
);

[...matches].forEach(({ groups }) => {
  shipIcons[groups.id] = groups.value
    // Handle unicode
    .replace(/^\\([0-9a-fA-F]+)$/, (_, val) =>
      String.fromCharCode(parseInt(val, 16))
    )
    // Handle weird double forward slash of delt-7
    .replace('\\\\', '\\');
});

// Delta7b
shipIcons['delta7baethersprite'] = shipIcons['delta7aethersprite'];
// TIE/ln Interceptor
shipIcons['tieininterceptor'] = shipIcons['tieinterceptor'];

await fs.outputJson(`${DATA_FOLDER}/ship-icons.json`, shipIcons, { spaces: 2 });
