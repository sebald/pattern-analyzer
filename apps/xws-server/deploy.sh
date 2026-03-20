#!/usr/bin/env bash
set -euo pipefail

cd ~/pattern-analyzer

# Ensure pnpm is available
if ! command -v pnpm &> /dev/null; then
  echo "Installing pnpm..."
  npm install -g pnpm@8
fi

# Ensure PM2 is available
if ! command -v pm2 &> /dev/null; then
  echo "Installing PM2..."
  npm install -g pm2
fi

git pull origin main
pnpm install
pnpm --filter @pattern-analyzer/xws build
pnpm --filter xws-server build

# Start or restart
if pm2 describe xws-server &> /dev/null; then
  pm2 restart xws-server
else
  cd apps/xws-server
  pm2 start ecosystem.config.cjs
  pm2 save
fi
