import { sql } from 'kysely';
import { toDate } from '@/lib/utils/date.utils';

import { db, type TournamentsTable } from './db';
import { type DateFilter } from './types';

// Add
// ---------------
export const addTournaments = async (
  tournaments: Omit<TournamentsTable, 'id'>[]
) => db.insertInto('tournaments').values(tournaments).execute();

// Get
// ---------------
export const getTournaments = async ({ from, to }: DateFilter) => {
  const query = db
    .selectFrom('tournaments')
    .select(['listfortress_ref as id', 'name', 'date']);

  if (from) {
    query.where('date', '<=', typeof from === 'string' ? from : toDate(from));
  }

  if (to) {
    query.where('date', '>=', typeof to === 'string' ? to : toDate(to));
  }

  return query.execute();
};

// Info
// ---------------
export const getTournamentsInfo = async ({ from, to }: DateFilter) => {
  const tc = db
    .selectFrom('tournaments')
    .select(eb => [eb.fn.countAll().as('tournaments_count')]);

  const sc = db
    .selectFrom('squads')
    .select(eb => [eb.fn.countAll().as('squqads_count')]);

  if (from) {
    tc.where('date', '<=', typeof from === 'string' ? from : toDate(from));
    sc.where('date', '<=', typeof from === 'string' ? from : toDate(from));
  }

  if (to) {
    tc.where('date', '>=', typeof to === 'string' ? to : toDate(to));
    sc.where('date', '>=', typeof to === 'string' ? to : toDate(to));
  }

  const result = await Promise.all([
    tc.executeTakeFirstOrThrow(),
    sc.executeTakeFirstOrThrow(),
  ]);

  return {
    count: {
      tournament: Number(result[0].tournaments_count),
      squads: Number(result[1].squqads_count),
    },
  };
};
