#!/usr/bin/env zx
import 'zx/globals';

const PROJECT_ROOT = path.resolve(__dirname, '..');
const TARGET = path.join(PROJECT_ROOT, 'lib/data');

const YASB_FILE_PATH = path.resolve(__dirname, 'yasb.tmp.js');

/**
 * Get YASB data from the source file
 */
const res = await fetch('https://yasb.app/javascripts/xwingcontent.min.js');
const contents = await res.text();
await fs.outputFile(YASB_FILE_PATH, contents);

const data = require(YASB_FILE_PATH).basicCardData();

const pilots = data.pilotsById.map(({ id, name, ship, points, xws }) => ({
  id,
  name,
  ship,
  points,
  xws,
}));
const upgrades = data.upgradesById.map(({ id, name, points, xws }) => ({
  id,
  name,
  points,
  xws,
}));

await fs.outputJson(
  `${TARGET}/yasb.json`,
  {
    pilots,
    upgrades,
  },
  { spaces: 2 }
);
