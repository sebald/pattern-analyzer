# TODO

## High Priority

- [x] Fix sync workflow hardcoded token — use `SYNC_TOKEN` secret instead
- [x] Add lint and typecheck to CI
- [x] Split CI into parallel jobs (lint, typecheck, test)
- [x] Fix CI typecheck — add `^build` dependency in turbo.json
- [x] Rotate `SYNC_TOKEN` GitHub secret (old value exposed in git history)

## Medium Priority

- [x] Add database indexes for frequently queried columns (`date`, `composition`, `faction`)
- [x] Fix DB scripts hanging (missing `db.destroy()`, race condition in squad inserts)
- [x] Fix CJS/ESM interop for DB scripts on Node 24
- [x] Add configurable DB pool size (`DB_POOL_SIZE`) for scripts
- [ ] Add `.env.example` documenting required environment variables
- [ ] Fix `jest.config.js` broken module aliases (`$` instead of `(.*)`)
- [ ] Sync API should return 401 for invalid tokens, not 200
- [x] Remove `delay(5000)` hack in sync route

## Low Priority

- [ ] Fix typo `updateRcord` → `updateRecord` in `lib/vendor/listfortress.ts`
- [ ] Tighten `any` types to `unknown` in `lib/types.ts` (Listfortress API fields)
- [ ] Re-export `ui/stats/` and `ui/params/` from `ui/index.ts` barrel for consistency
- [ ] Add `declarationMap: true` to `packages/xws/tsconfig.json`
- [ ] Add `engines` field to `package.json` to enforce Node version
- [ ] Unify test runners (Jest + Vitest → pick one)

## Done (this branch)

- [x] Rename web app package to `pattern-analyzer.app`
- [x] Include web app in changesets versioning
- [x] Update CLAUDE.md with changeset docs and correct package references
- [x] Update monorepo structure in CLAUDE.md to reference `packages/xws/`
