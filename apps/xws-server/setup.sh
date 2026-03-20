#!/usr/bin/env bash
set -euo pipefail

# VPS Initial Setup Script for xws-server
# ----------------------------------------
# Run this script once on a fresh VPS (e.g. Hetzner) to set up
# the runtime environment for the xws-server.

# 1. Install Node.js via NodeSource (LTS)
# curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
# sudo apt-get install -y nodejs

# 2. Install pnpm
# npm install -g pnpm@8

# 3. Install PM2 globally
# npm install -g pm2

# 4. Clone the repo
# git clone https://github.com/sebald/pattern-analyzer.git
# cd pattern-analyzer

# 5. Install dependencies
# pnpm install

# 6. Build the xws package and server
# pnpm --filter @pattern-analyzer/xws build
# pnpm --filter xws-server build

# 7. Start with PM2
# cd apps/xws-server
# pm2 start ecosystem.config.js
# pm2 save
# pm2 startup  # follow the instructions to enable auto-start on boot

echo "Review and uncomment the commands above to provision the VPS."
