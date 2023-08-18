#!/usr/bin/env tsx
import 'zx/globals';
import dotenv from 'dotenv';

import { pointsUpdateDate } from '@/lib/config';
import { getAllTournaments, getSquads } from '@/lib/vendor/listfortress';
import { fromDate } from '@/lib/utils/date.utils';
import { percentile } from '@/lib/utils/math.utils';
import { normalize, toCompositionId } from '@/lib/xws';

// Config
// ---------------
$.verbose = false;
dotenv.config({ path: '.env.local' });

// Script
// ---------------
void (async () => {
  // Loading dynamically so env is correctly loaded.
  const { initDatabase, teardownDatabase } = await import('@/lib/db/db');
  const { addTournaments } = await import('@/lib/db/tournaments');
  const { addSquads } = await import('@/lib/db/squads');
  const { setLastSync } = await import('@/lib/db/system');

  try {
    console.log('🌱 Create Tables...');
    await teardownDatabase();
    await initDatabase();

    console.log('🏆 Fetching tournaments...');
    const tournaments = await getAllTournaments({
      from: fromDate(pointsUpdateDate),
      format: 'standard',
    }).then(result =>
      result.map(({ id, name, date }) => ({
        listfortress_ref: id,
        name,
        date,
      }))
    );

    console.log('🚛 Adding tournaments...');
    await addTournaments(tournaments);

    let squadCount = 0;
    console.log('🚀 Adding squads...');
    await Promise.all(
      tournaments
        .map(async tournament => {
          const squads = await getSquads({
            id: `${tournament.listfortress_ref}`,
          });
          squadCount += squads.length;

          return squads.map(squad =>
            addSquads([
              {
                listfortress_ref: tournament.listfortress_ref,
                composition: squad.xws ? toCompositionId(squad.xws) : undefined,
                faction: squad.xws?.faction || 'unknown',
                player: squad.player,
                date: tournament.date,
                xws: normalize(squad.xws) || undefined,
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
              },
            ])
          );
        })
        .flat()
    );

    console.log('⏲️  Update last sync...');
    await setLastSync();

    console.log(
      `🏁 Setup done! (${tournaments.length} Tournaments, ${squadCount} Squads)`
    );
  } catch (err: any) {
    console.log(chalk.red.bold(err?.body?.message || err.message || err));
  }
})();
