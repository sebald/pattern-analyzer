import { Generated, Kysely } from 'kysely';
import { PlanetScaleDialect } from 'kysely-planetscale';

import type { XWSFaction, XWSSquad } from '@/lib/types';

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
  xws?: XWSSquad;
  wins: number;
  ties: number;
  losses: number;
  swiss: number;
  cut?: number;
  percentile: string;
}

export interface SystemTable {
  key: string;
  value: string;
}

interface Database {
  tournaments: TournamentsTable;
  squads: SquadsTable;
  system: SystemTable;
}

// Database
// ---------------
export const db = new Kysely<Database>({
  dialect: new PlanetScaleDialect({
    url: process.env.DATABASE_URL,
  }),
  log: ['query'],
});

export const initDatabase = async () =>
  Promise.allSettled([
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
      .addColumn('listfortress_ref', 'integer', col =>
        col.unsigned().notNull().unique()
      )
      .addColumn('composition', 'varchar(255)')
      .addColumn('faction', 'varchar(50)', col => col.notNull())
      .addColumn('player', 'varchar(100)')
      .addColumn('date', 'datetime', col => col.notNull())
      .addColumn('xws', 'json')
      .addColumn('wins', 'integer', col => col.unsigned().notNull())
      .addColumn('ties', 'integer', col => col.unsigned().notNull())
      .addColumn('losses', 'integer', col => col.unsigned().notNull())
      .addColumn('swiss', 'integer', col => col.unsigned().notNull())
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

export const teatdownDatabase = async () =>
  Promise.allSettled([
    db.schema.dropIndex('tournaments').ifExists().execute(),
    db.schema.dropTable('squads').ifExists().execute(),
    db.schema.dropTable('system').ifExists().execute(),
  ]);
