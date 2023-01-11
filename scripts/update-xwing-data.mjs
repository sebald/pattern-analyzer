#!/usr/bin/env zx
import 'zx/globals';

/**
 * Script to transform `xwing-data2` into a more convenient format.
 * Only required data is gathered and flatten before writting to a JSON file.
 */
const PROJECT_ROOT = path.resolve(__dirname, '..');

// Small helper to read in data
const XWING_DATA_ROOT = path.resolve(PROJECT_ROOT, 'node_modules/xwing-data2');
const read = async file =>
  await fs.readJson(path.resolve(XWING_DATA_ROOT, file));

// The manifest contains relative file paths to all JSON files.
const manifest = await read('data/manifest.json');

const factions = await read(manifest.factions[0]);

echo(JSON.stringify(factions, null, 2));
