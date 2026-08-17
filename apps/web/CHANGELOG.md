# pattern-analyzer.app

## 0.4.2

### Patch Changes

- [`4fd68de`](https://github.com/sebald/pattern-analyzer/commit/4fd68dec481423087446afbcbaee83fb33f50b19) Thanks [@sebald](https://github.com/sebald)! - Remove the "Powered by Vercel" banner from the site footer.

  Add a "Last 6 Months" option to the date range filter used by the stats and data pages. Like "Last 3 Months", it only shows up once the last points update is older than that, so a selected range never spans two metas.

- [#525](https://github.com/sebald/pattern-analyzer/pull/525) [`f7e269d`](https://github.com/sebald/pattern-analyzer/commit/f7e269d07f6ab44aa4f01014b7bbc8619136daca) Thanks [@sebald](https://github.com/sebald)! - Fix stats pages being empty and composition/pilot detail pages returning a 404
  right after a points update.

  The window all stats are calculated for is now resolved in one place
  (`lib/stats/range.ts`). It defaults to the last points update and automatically
  widens to the last six months while that window does not hold enough data yet,
  which the date range caption now points out. Detail pages use the same window
  instead of hardcoding the points update date.

  Aggregating an empty set of squads no longer throws (which was reported as a 404) but renders an empty state, and frequencies show 0% instead of NaN when
  there is nothing to divide by.

## 0.4.1

### Patch Changes

- [#519](https://github.com/sebald/pattern-analyzer/pull/519) [`bb4e556`](https://github.com/sebald/pattern-analyzer/commit/bb4e5567ab0af85a8204ac674c59f5bcaffecf2a) Thanks [@sebald](https://github.com/sebald)! - Declare the database environment variables in `turbo.json` so they reach `next build`. Turborepo's strict env mode was filtering them out, which made the Vercel build fall back to `127.0.0.1:3306` and fail with `ECONNREFUSED` while collecting page data.

- [#510](https://github.com/sebald/pattern-analyzer/pull/510) [`7dd7b34`](https://github.com/sebald/pattern-analyzer/commit/7dd7b34f494362efce70a43384c6787ee803662c) Thanks [@sebald](https://github.com/sebald)! - Fix `update:yasb` script failing on Node 24. The downloaded YASB content is CommonJS-style code, but it was saved as `.js` under a `"type": "module"` package, causing Node to load it as ESM where `this` is undefined. Renamed the temp file to `.cjs` so it's always loaded as CommonJS.

- [#522](https://github.com/sebald/pattern-analyzer/pull/522) [`ad8eae6`](https://github.com/sebald/pattern-analyzer/commit/ad8eae6197bf2b4c5fdb02fb5a4b142746e377ed) Thanks [@sebald](https://github.com/sebald)! - Import the last six months of tournaments during `db:setup` when the last points update is less than six months ago. Right after a points update there is barely any tournament data, which previously left the database empty.

  Also guard `addTournaments` and `addSquads` against empty arrays. An insert without rows is invalid SQL, which made both `db:setup` and the scheduled sync fail whenever there was nothing new to add.

- [#521](https://github.com/sebald/pattern-analyzer/pull/521) [`5147e83`](https://github.com/sebald/pattern-analyzer/commit/5147e83fd902e606cc002c9f7953d52ccac4177d) Thanks [@sebald](https://github.com/sebald)! - Set the last points update to 2026-08-16.

- [#518](https://github.com/sebald/pattern-analyzer/pull/518) [`a8dd7ac`](https://github.com/sebald/pattern-analyzer/commit/a8dd7ac658593d742c14f0b1e87777ce4b77f728) Thanks [@sebald](https://github.com/sebald)! - Add root `update:points` script that runs the YASB and xwing-data updates, and refresh the generated point costs and display values.

- Updated dependencies [[`7dd7b34`](https://github.com/sebald/pattern-analyzer/commit/7dd7b34f494362efce70a43384c6787ee803662c), [`a8dd7ac`](https://github.com/sebald/pattern-analyzer/commit/a8dd7ac658593d742c14f0b1e87777ce4b77f728), [`ad8eae6`](https://github.com/sebald/pattern-analyzer/commit/ad8eae6197bf2b4c5fdb02fb5a4b142746e377ed), [`4fd9eca`](https://github.com/sebald/pattern-analyzer/commit/4fd9ecafa7c931ee9bbfd6d500a43acaf13a2cfc)]:
  - @pattern-analyzer/xws@3.2.0

## 0.4.0

### Minor Changes

- [#506](https://github.com/sebald/pattern-analyzer/pull/506) [`189bf95`](https://github.com/sebald/pattern-analyzer/commit/189bf95d9951fd7054272d099b88a12beb19220c) Thanks [@sebald](https://github.com/sebald)! - Replace API proxy routes with direct vendor calls from server components.

### Patch Changes

- Updated dependencies [[`189bf95`](https://github.com/sebald/pattern-analyzer/commit/189bf95d9951fd7054272d099b88a12beb19220c)]:
  - @pattern-analyzer/xws@3.1.0

## 0.3.1

### Patch Changes

- Updated dependencies [[`3b1a89a`](https://github.com/sebald/pattern-analyzer/commit/3b1a89ae6b992b5abacf447770acc6a697e4c699)]:
  - @pattern-analyzer/xws@3.0.1

## 0.3.0

### Minor Changes

- [#499](https://github.com/sebald/pattern-analyzer/pull/499) [`4619bf0`](https://github.com/sebald/pattern-analyzer/commit/4619bf06a9c902e0adca2a553c36c070fcd267fd) Thanks [@sebald](https://github.com/sebald)! - Remove barrel files across all projects, replacing re-exports with direct module imports for better tree-shaking and faster TypeScript compilation.

### Patch Changes

- Updated dependencies [[`4619bf0`](https://github.com/sebald/pattern-analyzer/commit/4619bf06a9c902e0adca2a553c36c070fcd267fd)]:
  - @pattern-analyzer/xws@3.0.0

## 0.2.0

### Minor Changes

- [#497](https://github.com/sebald/pattern-analyzer/pull/497) [`51b7c69`](https://github.com/sebald/pattern-analyzer/commit/51b7c690fd36d79b06c6dad8cb5e6e936c7052b1) Thanks [@sebald](https://github.com/sebald)! - Remove barrel files across all projects, replacing re-exports with direct module imports for better tree-shaking and faster TypeScript compilation.

### Patch Changes

- [#488](https://github.com/sebald/pattern-analyzer/pull/488) [`cf9d512`](https://github.com/sebald/pattern-analyzer/commit/cf9d512fd7cbbaef4c70d831fa9d7e7db6c10ab8) Thanks [@sebald](https://github.com/sebald)! - Add `engines` field to root package.json to enforce Node and pnpm versions.

- [#494](https://github.com/sebald/pattern-analyzer/pull/494) [`1080c80`](https://github.com/sebald/pattern-analyzer/commit/1080c800ebb568e1fc1a2516e45d82b7644fee5c) Thanks [@sebald](https://github.com/sebald)! - Re-export `ui/stats/` and `ui/params/` from barrel file for consistency.

- [#491](https://github.com/sebald/pattern-analyzer/pull/491) [`8821ea0`](https://github.com/sebald/pattern-analyzer/commit/8821ea045b5ea6797931cd74cf146bd30e6a6612) Thanks [@sebald](https://github.com/sebald)! - Fix typo: rename `updateRcord` to `updateRecord` in listfortress vendor module.

- [#492](https://github.com/sebald/pattern-analyzer/pull/492) [`43975c8`](https://github.com/sebald/pattern-analyzer/commit/43975c8e416e9ef81261e709fea1bb7815bcec63) Thanks [@sebald](https://github.com/sebald)! - Tighten `any` types to `unknown` in Listfortress API type definitions.

- Updated dependencies [[`51b7c69`](https://github.com/sebald/pattern-analyzer/commit/51b7c690fd36d79b06c6dad8cb5e6e936c7052b1), [`144d335`](https://github.com/sebald/pattern-analyzer/commit/144d3353b9d01b996b61b17e1e74485396ec4b5a)]:
  - @pattern-analyzer/xws@2.0.0

## 0.1.2

### Patch Changes

- [#481](https://github.com/sebald/pattern-analyzer/pull/481) [`8bf522c`](https://github.com/sebald/pattern-analyzer/commit/8bf522c238a45589a321013861a6642d717d8720) Thanks [@sebald](https://github.com/sebald)! - Add `.env.example` documenting all environment variables.

- [#482](https://github.com/sebald/pattern-analyzer/pull/482) [`e5056ed`](https://github.com/sebald/pattern-analyzer/commit/e5056ed54b13bb64c892989d0a6c7c537ceeafcb) Thanks [@sebald](https://github.com/sebald)! - Fix broken module aliases in jest.config.js that used `$` instead of `(.*)` for path mapping.

- [#484](https://github.com/sebald/pattern-analyzer/pull/484) [`2af6ea9`](https://github.com/sebald/pattern-analyzer/commit/2af6ea99d8f973f190a146d24b934c51e22d111f) Thanks [@sebald](https://github.com/sebald)! - Remove `delay(5000)` hack in sync route. The sync function already properly awaits all database operations via `Promise.all` and sequential `await` calls, so the artificial delay was unnecessary.

- [#483](https://github.com/sebald/pattern-analyzer/pull/483) [`cd0e9b5`](https://github.com/sebald/pattern-analyzer/commit/cd0e9b5cae3f3955daead262f3566263c5905345) Thanks [@sebald](https://github.com/sebald)! - Return 401 instead of 200 for invalid or missing sync tokens in the sync API endpoint.

## 0.1.1

### Patch Changes

- [#479](https://github.com/sebald/pattern-analyzer/pull/479) [`d1dba28`](https://github.com/sebald/pattern-analyzer/commit/d1dba2822e41c98d66b57ada7a542f6aadebe031) Thanks [@sebald](https://github.com/sebald)! - Fix DB scripts and add indexes for frequently queried columns

- [#476](https://github.com/sebald/pattern-analyzer/pull/476) [`b764989`](https://github.com/sebald/pattern-analyzer/commit/b76498992d5d4d5f455f31c24c4f930d8be45fee) Thanks [@sebald](https://github.com/sebald)! - Prepare `@pattern-analyzer/xws` for npm publishing

- Updated dependencies [[`d1dba28`](https://github.com/sebald/pattern-analyzer/commit/d1dba2822e41c98d66b57ada7a542f6aadebe031), [`67de6c3`](https://github.com/sebald/pattern-analyzer/commit/67de6c3b98fae2ed5a43106860a250c8ec47d4f7), [`b764989`](https://github.com/sebald/pattern-analyzer/commit/b76498992d5d4d5f455f31c24c4f930d8be45fee)]:
  - @pattern-analyzer/xws@1.0.0
