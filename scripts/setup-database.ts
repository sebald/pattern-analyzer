#!/usr/bin/env tsx
import 'zx/globals';

import { connect, type Config } from '@planetscale/database';
import dotenv from 'dotenv';

import { pointsUpdateDate } from '@/lib/config';
import { getAllTournaments, getSquads } from '@/lib/vendor/listfortress';
import { fromDate } from '@/lib/utils/date.utils';
import { percentile } from '@/lib/utils/math.utils';
import { normalize, toCompositionId } from '@/lib/xws';

import {
  initDatabase,
  teatdownDatabase as teardownDatabase,
} from '@/lib/db/db';
import { addTournaments } from '@/lib/db/tournaments';
import { addSquads } from '@/lib/db/squads';
import { setLastSync } from '@/lib/db/system';

// Config
// ---------------
$.verbose = false;
dotenv.config({ path: '.env.local' });
const config = {
  url: process.env.DATABASE_URL,
} satisfies Config;

// Script
// ---------------
void (async () => {
  const db = await connect(config);

  try {
    console.log('🌱 Create Tables...');
    // Clear everything!
    await teardownDatabase();

    // Create tables
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
      tournaments.map(async tournament => {
        const squads = await getSquads({
          id: `${tournament.listfortress_ref}`,
        });
        squadCount += squads.length;

        return addSquads(
          squads.map(squad => ({
            listfortress_ref: tournament.listfortress_ref,
            composition: squad.xws ? toCompositionId(squad.xws) : undefined,
            faction: squad.xws?.faction || 'unknown',
            player: squad.player,
            date: tournament.date,
            xws: squad.xws ? normalize(squad.xws)! : undefined,
            wins: squad.record.wins,
            ties: squad.record.ties,
            losses: squad.record.losses,
            record: squad.record,
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

    console.log('⏲️  Update last sync...');
    await setLastSync();

    console.log(
      `🏁 Setup done! (${tournaments.length} Tournaments, ${squadCount} Squads)`
    );
  } catch (err: any) {
    console.log(chalk.red.bold(err?.body?.message || err.message || err));
  }
})();
