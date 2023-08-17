import { toDate } from '@/lib/utils/date.utils';

import { SquadsTable, db } from './db';
import type { DateFilter, SquadEntitiy, SquadEntitiyWithXWS } from './types';

// Add
// ---------------
export const addSquads = async (squads: Omit<SquadsTable, 'id'>[]) =>
  db.insertInto('squads').values(squads).execute();

// Get
// ---------------
export interface GetSquadsProps extends DateFilter {
  composition?: string;
}

export type GetSquadsResult<Props extends GetSquadsProps> =
  Props['composition'] extends string ? SquadEntitiyWithXWS[] : SquadEntitiy[];

export const getSquads = async <Props extends GetSquadsProps>({
  from,
  to,
  composition,
}: Props): Promise<GetSquadsResult<Props>> => {
  let query = db
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
      'record',
      'swiss',
      'cut',
      'percentile',
    ]);

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

  if (composition) {
    query = query.where('composition', '=', composition);
  }

  const result = await query.execute();
  return result.map(squad => ({
    id: squad.id,
    player: squad.player,
    date: squad.date,
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
  })) as any; // Have to cast here :-/
};

// Count
// ---------------
export const getSquadsCount = async ({ from, to }: DateFilter) => {
  let query = db
    .selectFrom('squads')
    .select(eb => [eb.fn.countAll().as('squads_count')]);

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
  return Number(result.squads_count);
};

// Factions
// ---------------
export const getFactionCount = async ({ from, to }: DateFilter) => {
  let query = db
    .selectFrom('squads')
    .select(eb => ['faction', eb.fn.countAll().as('count')])
    .groupBy('faction');

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
