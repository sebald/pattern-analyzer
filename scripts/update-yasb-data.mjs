#!/usr/bin/env zx
import 'zx/globals';

const PROJECT_ROOT = path.resolve(__dirname, '..');
const TARGET = path.join(PROJECT_ROOT, 'lib/data');

const YASB_FILE_PATH = path.resolve(__dirname, 'yasb.tmp.js');

const res = await fetch('https://yasb.app/javascripts/xwingcontent.min.js');
const contents = await res.text();

await fs.outputFile(YASB_FILE_PATH, contents);

const foo = require(YASB_FILE_PATH);

console.log(foo.basicCardData());
