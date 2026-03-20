#!/usr/bin/env bash
set -euo pipefail

cd ~/pattern-analyzer
git pull origin main
pnpm install
pnpm --filter @pattern-analyzer/xws build
pnpm --filter xws-server build
pm2 restart xws-server
