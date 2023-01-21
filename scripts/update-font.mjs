#!/usr/bin/env zx
import 'zx/globals';

/**
 * Copy X-Wing fonts and data from CrazyVulcan's fork since
 * they are the most up to date I can find ..
 */
const PROJECT_ROOT = path.resolve(__dirname, '..');
const TARGET = path.join(PROJECT_ROOT, 'lib/data');

const SHIP_FONT_FILE = path.resolve(
  PROJECT_ROOT,
  'node_modules/xwing-font/dist/xwing-miniatures-ships.ttf'
);

$`cp ${SHIP_FONT_FILE} ${path.resolve(PROJECT_ROOT, 'app/fonts')}`;

const { ships } = await fs.readJSON(
  `${PROJECT_ROOT}/node_modules/xwing-font/src/json/ships-map.json`
);

await fs.outputJson(`${TARGET}/ship-font.json`, ships, {
  spaces: 2,
  encoding: 'utf8',
});
