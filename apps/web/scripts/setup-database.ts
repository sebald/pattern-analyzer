#!/usr/bin/env tsx
import 'zx/globals';
import dotenv from 'dotenv';
import pLimit from 'p-limit';

import { pointsUpdateDate } from '@/lib/config';
import { getAllTournaments, getSquads } from '@/lib/vendor/listfortress';
import { fromDate } from '@/lib/utils/date.utils';
import { percentile } from '@/lib/utils/math.utils';
import { normalize, toCompositionId, toFaction } from '@pattern-analyzer/xws/xws';
// Config
// ---------------
$.verbose = false;
dotenv.config({ path: '.env.local' });
process.env.DB_POOL_SIZE = '10';
const limit = pLimit(100);

// Workaround: tsx on Node 24 wraps ESM dynamic imports in a default export
const resolve = <T>(mod: T): T =>
  (mod as any).default ?? mod;

// Script
// ---------------
void (async () => {
  // Loading dynamically so env is correctly loaded.
  const { db, initDatabase, teardownDatabase } = resolve(await import('@/lib/db/db'));
  const { addTournaments } = resolve(await import('@/lib/db/tournaments'));
  const { addSquads } = resolve(await import('@/lib/db/squads'));
  const { setLastSync } = resolve(await import('@/lib/db/system'));

  try {
    console.log('🌱 Create Tables...');
    await teardownDatabase();
    await initDatabase();

    console.log('🏆 Fetching tournaments...');
    const tournaments = await getAllTournaments({
      from: fromDate(pointsUpdateDate),
      format: 'other',
    }).then(result =>
      result.map(({ id, name, date, location, country }) => ({
        listfortress_ref: id,
        name,
        date,
        location,
        country,
      }))
    );

    console.log('🚛 Adding tournaments...');
    await addTournaments(tournaments);

    let squadCount = 0;
    console.log('🚀 Adding squads...');
    const squadInserts = await Promise.all(
      tournaments.map(async tournament => {
        const squads = await getSquads({
          id: `${tournament.listfortress_ref}`,
        });
        squadCount += squads.length;

        return squads.map(squad =>
          limit(() =>
            addSquads([
              {
                listfortress_ref: tournament.listfortress_ref,
                composition: squad.xws
                  ? toCompositionId(squad.xws)
                  : undefined,
                faction: toFaction(squad.xws?.faction),
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
              },
            ])
          )
        );
      })
    );
    await Promise.all(squadInserts.flat());

    console.log('⏲️  Update last sync...');
    await setLastSync();

    console.log(
      `🏁 Setup done! (${tournaments.length} Tournaments, ${squadCount} Squads)`
    );

  } catch (err: any) {
    console.log(chalk.red.bold(err?.body?.message || err.message || err));
  } finally {
    await db.destroy();
  }
})();
