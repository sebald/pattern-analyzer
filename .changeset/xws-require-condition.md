---
'@pattern-analyzer/xws': minor
---

Add a `require` condition to every export subpath. The package stays ESM-only, but CommonJS callers on Node versions with `require(esm)` support can now load it — which is what the `tsx`-run database scripts in the app need.
