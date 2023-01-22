#!/usr/bin/env zx
import 'zx/globals';

const PROJECT_ROOT = path.resolve(__dirname, '..');
const DATA_FOLDER = path.join(PROJECT_ROOT, 'lib/data');
const FONT_FOLDER = path.join(PROJECT_ROOT, 'app/fonts');

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
const upgrades = data.upgradesById.map(({ id, name, slot, xws }) => ({
  id,
  name,
  slot,
  xws,
}));

await fs.outputJson(
  `${DATA_FOLDER}/yasb.json`,
  {
    pilots,
    upgrades,
  },
  { spaces: 2 }
);

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
