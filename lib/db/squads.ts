import { toDate } from '@/lib/utils/date.utils';

import { SquadsTable, db } from './db';
import type { DateFilter, SquadEntitiy } from './types';
import { XWSFaction } from '../types';

// Add
// ---------------
export const addSquads = async (squads: Omit<SquadsTable, 'id'>[]) =>
  db.insertInto('squads').values(squads).execute();

// Get
// ---------------
export const getSquads = async ({ from, to }: DateFilter) => {
  const query = db
    .selectFrom('squads')
    .select([
      'id',
      'composition',
      'faction',
      'player',
      'date',
      'xws',
      'wins',
      'ties',
      'losses',
      'swiss',
      'cut',
      'percentile',
    ]);

  if (from) {
    query.where('date', '<=', typeof from === 'string' ? from : toDate(from));
  }

  if (to) {
    query.where('date', '>=', typeof to === 'string' ? to : toDate(to));
  }

  const result = await query.execute();
  return result.map(squad => ({
    id: squad.id,
    player: squad.player,
    date: new Date(squad.date),
    rank: {
      swiss: squad.swiss,
      elimination: squad.cut,
    },
    record: {
      wins: squad.wins,
      ties: squad.ties,
      losses: squad.losses,
    },
    xws: squad.xws,
    faction: squad.faction,
    composition: squad.composition,
    percentile: Number(squad.percentile),
  })) satisfies SquadEntitiy[];
};

// Count
// ---------------
export const getSquadsCount = async ({ from, to }: DateFilter) => {
  const query = db
    .selectFrom('squads')
    .select(eb => [eb.fn.countAll().as('squads_count')]);

  if (from) {
    query.where('date', '<=', typeof from === 'string' ? from : toDate(from));
  }

  if (to) {
    query.where('date', '>=', typeof to === 'string' ? to : toDate(to));
  }

  const result = await query.executeTakeFirstOrThrow();
  return Number(result.squads_count);
};

// Factions
// ---------------
export const getFactionCount = async ({ from, to }: DateFilter) => {
  const query = db
    .selectFrom('squads')
    .select(eb => ['faction', eb.fn.countAll().as('count')])
    .groupBy('faction');

  if (from) {
    query.where('date', '<=', typeof from === 'string' ? from : toDate(from));
  }

  if (to) {
    query.where('date', '>=', typeof to === 'string' ? to : toDate(to));
  }

  const result = await query.execute();
  const map = {
    all: 0,
    rebelalliance: 0,
    galacticempire: 0,
    scumandvillainy: 0,
    resistance: 0,
    firstorder: 0,
    galacticrepublic: 0,
    separatistalliance: 0,
    unknown: 0,
  };

  result.forEach(({ faction, count }) => {
    const num = Number(count);
    map['all'] += num;
    map[faction] += num;
  });

  return map;
};
