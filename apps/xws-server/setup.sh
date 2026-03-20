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

# 4. Install Caddy (Debian/Ubuntu)
# sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https
# curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
# curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
# sudo apt update
# sudo apt install caddy

# 5. Clone the repo
# git clone https://github.com/sebald/pattern-analyzer.git
# cd pattern-analyzer

# 6. Install dependencies
# pnpm install

# 7. Build the xws package and server
# pnpm --filter @pattern-analyzer/xws build
# pnpm --filter xws-server build

# 8. Start with PM2
# cd apps/xws-server
# pm2 start ecosystem.config.js
# pm2 save
# pm2 startup  # follow the instructions to enable auto-start on boot

# 9. Configure Caddy
# sudo cp Caddyfile /etc/caddy/Caddyfile
# sudo systemctl reload caddy

echo "Review and uncomment the commands above to provision the VPS."
