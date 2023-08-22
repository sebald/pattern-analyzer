import { NextRequest, NextResponse } from 'next/server';
import { addSquads } from '@/lib/db/squads';
import { addTournaments } from '@/lib/db/tournaments';
import { getAllTournaments, getSquads } from '@/lib/vendor/listfortress';
import { getLastSync, setLastSync } from '@/lib/db/system';
import { normalize, toCompositionId } from '@/lib/xws';
import { percentile } from '@/lib/utils/math.utils';

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

  // Find new tournaments
  const tournaments = await getAllTournaments({
    from: lastSync,
    format: 'standard',
  }).then(result =>
    result.map(({ id, name, date }) => ({
      listfortress_ref: id,
      name,
      date,
    }))
  );

  if (tournaments.length === 0) {
    return NextResponse.json(
      {
        name: 'Sync Complete!',
        message: 'Already up to date!',
      },
      {
        status: 200,
      }
    );
  }

  // Add new tournaments
  await addTournaments(tournaments);

  // Find new squads + add
  let squadCount = 0;
  await Promise.all(
    tournaments.map(async tournament => {
      const squads = await getSquads({
        id: `${tournament.listfortress_ref}`,
      });
      squadCount += squads.length;

      return addSquads(
        squads.map(squad => ({
          listfortress_ref: tournament.listfortress_ref,
          composition: squad.xws ? toCompositionId(squad.xws) : undefined,
          faction: squad.xws?.faction ?? 'unknown',
          player: squad.player,
          date: tournament.date,
          xws: squad.xws
            ? JSON.stringify(normalize(squad.xws)) || undefined
            : undefined,
          wins: squad.record.wins,
          ties: squad.record.ties,
          losses: squad.record.losses,
          record: JSON.stringify(squad.record),
          swiss: squad.rank.swiss,
          cut: squad.rank.elimination,
          percentile: percentile(
            squad.rank.elimination ?? squad.rank.swiss,
            squads.length
          ).toString(),
        }))
      );
    })
  );

  await setLastSync();

  return NextResponse.json(
    {
      name: 'Sync Complete!',
      message: `Synced ${tournaments.length} tournaments including ${squadCount} squads.`,
    },
    {
      status: 200,
    }
  );
};