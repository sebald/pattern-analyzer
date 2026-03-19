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
  const dbModule = await import('@/lib/db/db');
  const { db } = dbModule.default ?? dbModule;
  const systemModule = await import('@/lib/db/system');
  const { getLastSync } = systemModule.default ?? systemModule;
  const syncModule = await import('@/lib/db/sync');
  const { sync } = syncModule.default ?? syncModule;

  try {
    console.log('🔄 Starting Sync...');

    const msg = await sync(new Date());
    console.log(`📧 ${msg.message}`);

    const latestSync = await getLastSync();
    console.log(`✅ Latest Sync: ${latestSync}`);

  } catch (err: any) {
    console.log(chalk.red.bold(err?.body?.message || err.message || err));
  } finally {
    await db.destroy();
  }
})();
