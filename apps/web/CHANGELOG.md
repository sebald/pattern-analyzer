# pattern-analyzer.app

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
