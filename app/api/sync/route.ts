import { NextRequest, NextResponse } from 'next/server';
import { getLastSync } from '@/lib/db/system';
import { sync } from '@/lib/db/sync';

/**
 * For whatever reasons the async tasks (db requests)
 * dont wait until the whole thing is really finished.
 * Hotfix to just wait a bit ... bad, but whatever until
 * we know why this is happening.
 */
const delay = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// POST
// ---------------
export const POST = async (request: NextRequest) => {
  const { token } = await request.json();
  const lastSync = await getLastSync();

  if (token !== process.env.SYNC_TOKEN) {
    return NextResponse.json(
      {
        name: 'Sync Info!',
        message: `Latest sync at ${lastSync}`,
      },
      {
        status: 200,
      }
    );
  }

  const msg = await sync(lastSync);

  // Let's hope 5 seconds is enought to add new squads...
  await delay(5000);

  return NextResponse.json(msg, {
    status: 200,
  });
};
