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

await fs.outputJson(
  `${TARGET}/yasb.json`,
  {
    pilots: data.pilotsById,
    ships: data.ships,
    upgrades: data.upgradesById,
  },
  { spaces: 2 }
);
