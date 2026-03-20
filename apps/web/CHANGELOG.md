# pattern-analyzer.app

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
