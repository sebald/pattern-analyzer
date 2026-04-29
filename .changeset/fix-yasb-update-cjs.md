---
'@pattern-analyzer/xws': patch
'pattern-analyzer.app': patch
---

Fix `update:yasb` script failing on Node 24. The downloaded YASB content is CommonJS-style code, but it was saved as `.js` under a `"type": "module"` package, causing Node to load it as ESM where `this` is undefined. Renamed the temp file to `.cjs` so it's always loaded as CommonJS.
