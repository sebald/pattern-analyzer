---
'@pattern-analyzer/xws': minor
---

Declare `engines.node: ">=20.19"`. The `require` condition added in the previous release maps to ESM output, so CommonJS callers depend on `require(esm)` — available unflagged in Node 20.19+ and 22.12+. On older versions `require()` throws `ERR_REQUIRE_ESM`, so the constraint now matches what the package actually supports.
