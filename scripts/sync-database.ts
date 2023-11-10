#!/usr/bin/env tsx
import 'zx/globals';
import dotenv from 'dotenv';

// Config
// ---------------
$.verbose = true;
dotenv.config({ path: '.env.local' });

// Queries
// ---------------

// Script
// ---------------
void (async () => {
  const { getLastSync } = await import('@/lib/db/system');
  const { sync } = await import('@/lib/db/sync');

  try {
    console.log('🔄 Starting Sync...');

    const msg = await sync(new Date());
    console.log(`📧 ${msg.message}`);

    const latestSync = await getLastSync();
    console.log(`✅ Latest Sync: ${latestSync}`);
  } catch (err: any) {
    console.log(chalk.red.bold(err?.body?.message || err.message || err));
  }
})();
