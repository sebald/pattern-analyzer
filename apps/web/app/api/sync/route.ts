import { NextRequest, NextResponse } from 'next/server';
import { getLastSync } from '@/lib/db/system';
import { sync } from '@/lib/db/sync';

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

  return NextResponse.json(msg, {
    status: 200,
  });
};
