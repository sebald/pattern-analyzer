import { NextRequest, NextResponse } from 'next/server';
import { getLastSync } from '@/lib/db';
import { getAllTournaments } from '@/lib/vendor/listfortress';

// Handler
// ---------------
export const GET = async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);

  const token = searchParams.get('token');

  if (token !== process.env.SYNC_TOKEN) {
    return NextResponse.json(
      {
        name: 'Nope...',
        message: 'ಠ_ಠ U no syncing!',
      },
      {
        status: 401,
      }
    );
  }

  const lastSync = await getLastSync();
  const tournaments = await getAllTournaments({
    from: lastSync,
    format: 'standard',
  });

  console.log(lastSync, tournaments);

  return NextResponse.json(
    {
      name: 'Sync Complete!',
      message: `Synced ... tournaments`,
    },
    {
      status: 200,
    }
  );
};
