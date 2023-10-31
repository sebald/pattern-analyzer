import { Kysely, MysqlDialect } from 'kysely';
import { type ColumnType, type Generated } from 'kysely';
import { createPool } from 'mysql2';

import type { GameRecord, XWSFaction, XWSSquad } from '@/lib/types';

// Types
// ---------------
export interface TournamentsTable {
  id: Generated<number>;
  listfortress_ref: number;
  name: string;
  date: string;
}

export interface SquadsTable {
  id: Generated<number>;
  listfortress_ref: number;
  composition?: string;
  faction: XWSFaction | 'unknown';
  player: string;
  date: string;
  xws?: ColumnType<XWSSquad, string, string>;
  wins: number;
  ties: number;
  losses: number;
  record: ColumnType<GameRecord, string, string>;
  swiss: number;
  cut?: number;
  percentile: string;
}

export interface SystemTable {
  key: string;
  value: string;
}

export interface Database {
  tournaments: TournamentsTable;
  squads: SquadsTable;
  system: SystemTable;
}

// Database
// ---------------
export const db = new Kysely<Database>({
  dialect: new MysqlDialect({
    pool: async () =>
      createPool({
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        database: 'main',
      }),
  }),
  // log: ['query', 'error'],
});

export const initDatabase = async () =>
  Promise.all([
    // Tournaments
    db.schema
      .createTable('tournaments')
      .addColumn('id', 'integer', col =>
        col.primaryKey().autoIncrement().unsigned()
      )
      .addColumn('listfortress_ref', 'integer', col =>
        col.unsigned().notNull().unique()
      )
      .addColumn('name', 'varchar(100)', col => col.notNull())
      .addColumn('date', 'datetime', col => col.notNull())
      .execute(),
    // Squads
    db.schema
      .createTable('squads')
      .addColumn('id', 'integer', col =>
        col.primaryKey().autoIncrement().unsigned()
      )
      .addColumn('listfortress_ref', 'integer', col => col.unsigned().notNull())
      .addColumn('composition', 'varchar(255)')
      .addColumn('faction', 'varchar(50)', col => col.notNull())
      .addColumn('player', 'varchar(100)')
      .addColumn('date', 'datetime', col => col.notNull())
      .addColumn('xws', 'json')
      .addColumn('wins', 'integer', col => col.unsigned().notNull())
      .addColumn('ties', 'integer', col => col.unsigned().notNull())
      .addColumn('losses', 'integer', col => col.unsigned().notNull())
      .addColumn('swiss', 'integer', col => col.unsigned().notNull())
      .addColumn('record', 'json', col => col.notNull())
      .addColumn('cut', 'integer', col => col.unsigned())
      .addColumn('percentile', 'decimal(5, 4)', col => col.notNull())
      .execute(),
    // System
    db.schema
      .createTable('system')
      .addColumn('key', 'varchar(50)', col => col.primaryKey())
      .addColumn('value', 'text')
      .execute(),
  ]);

export const teardownDatabase = async () =>
  Promise.all([
    db.schema.dropTable('tournaments').ifExists().execute(),
    db.schema.dropTable('squads').ifExists().execute(),
    db.schema.dropTable('system').ifExists().execute(),
  ]);
