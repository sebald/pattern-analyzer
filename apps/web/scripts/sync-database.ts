#!/usr/bin/env tsx
import 'zx/globals';
import dotenv from 'dotenv';

// Config
// ---------------
$.verbose = true;
dotenv.config({ path: '.env.local' });

// Workaround: tsx on Node 24 wraps ESM dynamic imports in a default export
const resolve = <T>(mod: T): T =>
  (mod as any).default ?? mod;

// Script
// ---------------
void (async () => {
  const { db } = resolve(await import('@/lib/db/db'));
  const { getLastSync } = resolve(await import('@/lib/db/system'));
  const { sync } = resolve(await import('@/lib/db/sync'));

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
