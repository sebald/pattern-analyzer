#!/usr/bin/env tsx
import 'zx/globals';

import { connect, type Config } from '@planetscale/database';
import dotenv from 'dotenv';

import { pointsUpdateDate } from '@/lib/config';
import { getAllTournaments, getSquads } from '@/lib/vendor/listfortress';
import { fromDate, now } from '@/lib/utils/date.utils';
import { percentile } from '@/lib/utils/math.utils';
import { normalize, toCompositionId } from '@/lib/xws';

$.verbose = false;

// Config
// ---------------
dotenv.config({ path: '.env.local' });
const config = {
  url: process.env.DATABASE_URL,
} satisfies Config;

// Queries
// ---------------
const CREATE_TOURNAMENTS_TABLE = `
CREATE TABLE tournaments (
  id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  listfortress_ref INT UNSIGNED NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  date DATETIME NOT NULL
);`;

const INSERT_TOURNAMENT =
  'INSERT INTO tournaments (`listfortress_ref`, `name`, `date`) VALUES (:ref, :name, :date)';

const CREATE_SQUADS_TABLE = `
CREATE TABLE squads (
  id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  listfortress_ref INT UNSIGNED NOT NULL,
  composition VARCHAR(255),
  faction VARCHAR(50) NOT NULL,
  player VARCHAR(100),
  date DATETIME NOT NULL,
  xws JSON,
  wins INT UNSIGNED,
  ties INT UNSIGNED,
  losses INT UNSIGNED,
  swiss INT UNSIGNED,
  cut INT UNSIGNED,
  percentile DECIMAL(5, 4) NOT NULL
);`;

const INSERT_SQUAD =
  'INSERT INTO squads (`listfortress_ref`, `composition`, `faction`, `player`, `date`, `xws`, `wins`, `ties`, `losses`, `swiss`, `cut`, `percentile`) VALUES (:ref, :composition, :faction, :player, :date, :xws, :wins, :ties, :losses, :swiss, :cut, :percentile)';

/**
 * Pseudo Redis, don't want to have the maintanance overhead
 * using a dedicated KeyValue-storage (like `kv`) for one value (sync).
 */
const CREATE_SYSTEM_TABLE = `
CREATE TABLE system (
  \`key\` VARCHAR(100) PRIMARY KEY,
  \`value\` TEXT
);
`;

const INSERT_SYSTEM =
  'INSERT INTO system (`key`, `value`) VALUES (:key, :value)';

// Script
// ---------------
void (async () => {
  const db = await connect(config);

  try {
    console.log('🌱 Create Tables...');
    // Clear everything!
    await db.execute('DROP TABLE IF EXISTS squads;');
    await db.execute('DROP TABLE IF EXISTS tournaments;');
    await db.execute('DROP TABLE IF EXISTS system;');

    // Create tables
    await db.execute(CREATE_TOURNAMENTS_TABLE);
    await db.execute(CREATE_SQUADS_TABLE);
    await db.execute(CREATE_SYSTEM_TABLE);

    console.log('🏆 Fetching tournaments...');
    const tournaments = await getAllTournaments({
      from: fromDate(pointsUpdateDate),

      format: 'standard',
    });

    console.log('🚛 Inserting tournaments...');
    await Promise.all(
      tournaments.map(tournament =>
        db.execute(INSERT_TOURNAMENT, {
          ref: tournament.id,
          name: tournament.name,
          date: tournament.date,
        })
      )
    );

    let squadCount = 0;
    console.log('🚀 Inserting squads...');
    await Promise.all(
      tournaments.map(async tournament => {
        const squads = await getSquads({ id: `${tournament.id}` });
        squadCount += squads.length;

        return Promise.all(
          squads.map(squad =>
            db.execute(INSERT_SQUAD, {
              ref: tournament.id,
              composition: toCompositionId(squad.xws),
              faction: squad.xws?.faction || 'unkown',
              player: squad.player,
              date: tournament.date,
              xws: JSON.stringify(normalize(squad.xws)),
              wins: squad.record.wins,
              ties: squad.record.ties,
              losses: squad.record.losses,
              record: JSON.stringify(squad.record),
              swiss: squad.rank.swiss,
              cut: squad.rank.elimination,
              percentile: percentile(
                squad.rank.elimination ?? squad.rank.swiss,
                squads.length
              ),
            })
          )
        );
      })
    );

    console.log('⏲️  Update last sync...');
    await db.execute(INSERT_SYSTEM, {
      key: 'last_sync',
      value: now(),
    });

    console.log(
      `🏁 Setup done! (${tournaments.length} Tournaments, ${squadCount} Squads)`
    );
  } catch (err: any) {
    console.log(chalk.red.bold(err?.body?.message || err.message || err));
  }
})();
