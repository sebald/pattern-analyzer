# @pattern-analyzer/xws

## 3.1.1

### Patch Changes

- [#510](https://github.com/sebald/pattern-analyzer/pull/510) [`7dd7b34`](https://github.com/sebald/pattern-analyzer/commit/7dd7b34f494362efce70a43384c6787ee803662c) Thanks [@sebald](https://github.com/sebald)! - Fix `update:yasb` script failing on Node 24. The downloaded YASB content is CommonJS-style code, but it was saved as `.js` under a `"type": "module"` package, causing Node to load it as ESM where `this` is undefined. Renamed the temp file to `.cjs` so it's always loaded as CommonJS.

## 3.1.0

### Patch Changes

- [#506](https://github.com/sebald/pattern-analyzer/pull/506) [`189bf95`](https://github.com/sebald/pattern-analyzer/commit/189bf95d9951fd7054272d099b88a12beb19220c) Thanks [@sebald](https://github.com/sebald)! - Fix npm publish in release workflow to use OIDC trusted publishing.

## 3.0.1

### Patch Changes

- [#504](https://github.com/sebald/pattern-analyzer/pull/504) [`3b1a89a`](https://github.com/sebald/pattern-analyzer/commit/3b1a89ae6b992b5abacf447770acc6a697e4c699) Thanks [@sebald](https://github.com/sebald)! - Configure npm trusted publishing via OIDC.

## 3.0.0

### Major Changes

- [#499](https://github.com/sebald/pattern-analyzer/pull/499) [`4619bf0`](https://github.com/sebald/pattern-analyzer/commit/4619bf06a9c902e0adca2a553c36c070fcd267fd) Thanks [@sebald](https://github.com/sebald)! - Remove barrel files across all projects, replacing re-exports with direct module imports for better tree-shaking and faster TypeScript compilation.

## 2.0.0

### Major Changes

- [#497](https://github.com/sebald/pattern-analyzer/pull/497) [`51b7c69`](https://github.com/sebald/pattern-analyzer/commit/51b7c690fd36d79b06c6dad8cb5e6e936c7052b1) Thanks [@sebald](https://github.com/sebald)! - Remove barrel files across all projects, replacing re-exports with direct module imports for better tree-shaking and faster TypeScript compilation.

### Patch Changes

- [#493](https://github.com/sebald/pattern-analyzer/pull/493) [`144d335`](https://github.com/sebald/pattern-analyzer/commit/144d3353b9d01b996b61b17e1e74485396ec4b5a) Thanks [@sebald](https://github.com/sebald)! - Add `declarationMap: true` to tsconfig for improved IDE navigation.

## 1.0.0

### Major Changes

- [#477](https://github.com/sebald/pattern-analyzer/pull/477) [`67de6c3`](https://github.com/sebald/pattern-analyzer/commit/67de6c3b98fae2ed5a43106860a250c8ec47d4f7) Thanks [@sebald](https://github.com/sebald)! - Add README for `@pattern-analyzer/xws`

### Patch Changes

- [#479](https://github.com/sebald/pattern-analyzer/pull/479) [`d1dba28`](https://github.com/sebald/pattern-analyzer/commit/d1dba2822e41c98d66b57ada7a542f6aadebe031) Thanks [@sebald](https://github.com/sebald)! - Fix DB scripts and add indexes for frequently queried columns

- [#476](https://github.com/sebald/pattern-analyzer/pull/476) [`b764989`](https://github.com/sebald/pattern-analyzer/commit/b76498992d5d4d5f455f31c24c4f930d8be45fee) Thanks [@sebald](https://github.com/sebald)! - Prepare `@pattern-analyzer/xws` for npm publishing
