import { toDate } from '@/lib/utils/date.utils';

import { db, type TournamentsTable } from './db';
import { Pagination, type DateFilter } from './types';

// Add
// ---------------
export const addTournaments = async (
  tournaments: Omit<TournamentsTable, 'id'>[]
) => db.insertInto('tournaments').values(tournaments).execute();

// Get
// ---------------
export const getTournaments = async ({
  from,
  to,
  page,
  pageSize = 25,
}: DateFilter & Pagination) => {
  let query = db
    .selectFrom('tournaments')
    .leftJoin(
      'squads',
      'squads.listfortress_ref',
      'tournaments.listfortress_ref'
    )
    .select(({ fn }) => [
      'tournaments.listfortress_ref as id',
      'tournaments.name',
      'tournaments.date',
      'tournaments.country',
      'tournaments.location',
      fn.count<number>('squads.listfortress_ref').as('players'),
    ])
    .groupBy('tournaments.listfortress_ref')
    .orderBy('tournaments.date desc')
    .limit(pageSize);

  if (from) {
    query = query.where(
      'tournaments.date',
      '>=',
      typeof from === 'string' ? from : toDate(from)
    );
  }

  if (to) {
    query = query.where(
      'tournaments.date',
      '<=',
      typeof to === 'string' ? to : toDate(to)
    );
  }

  return query.execute();
};

// Info
// ---------------
export const getTournamentsInfo = async ({ from, to }: DateFilter) => {
  let tc = db
    .selectFrom('tournaments')
    .select(eb => [eb.fn.countAll().as('tournaments_count')]);

  let sc = db
    .selectFrom('squads')
    .select(eb => [eb.fn.countAll().as('squads_count')]);

  if (from) {
    tc = tc.where('date', '>=', typeof from === 'string' ? from : toDate(from));
    sc = sc.where('date', '>=', typeof from === 'string' ? from : toDate(from));
  }

  if (to) {
    tc = tc.where('date', '<=', typeof to === 'string' ? to : toDate(to));
    sc = sc.where('date', '<=', typeof to === 'string' ? to : toDate(to));
  }

  const result = await Promise.all([
    tc.executeTakeFirstOrThrow(),
    sc.executeTakeFirstOrThrow(),
  ]);

  return {
    count: {
      tournament: Number(result[0].tournaments_count),
      squads: Number(result[1].squads_count),
    },
  };
};

// Count
// ---------------
export const getTournamentsCount = async ({ from, to }: DateFilter) => {
  let query = db
    .selectFrom('tournaments')
    .select(eb => [eb.fn.countAll().as('tournaments_count')]);

  if (from) {
    query = query.where(
      'date',
      '>=',
      typeof from === 'string' ? from : toDate(from)
    );
  }

  if (to) {
    query = query.where('date', '<=', typeof to === 'string' ? to : toDate(to));
  }

  const result = await query.executeTakeFirstOrThrow();
  return Number(result.tournaments_count);
};
