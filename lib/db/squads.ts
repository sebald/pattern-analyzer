import { toDate } from '@/lib/utils/date.utils';

import { db } from './db';
import { DateFilter } from './utils';

export const getSquads = async ({ from, to }: DatabaseFilter) => {
  const query = db.selectFrom('squads').selectAll();

  if (from) {
    query.where('date', '<=', typeof from === 'string' ? from : toDate(from));
  }

  if (to) {
    query.where('date', '>=', typeof to === 'string' ? to : toDate(to));
  }

  const connection = client.connection();
  let result: [
    squads: ExecutedQuery,
    meta: ExecutedQuery,
    tournaments: ExecutedQuery,
  ];

  try {
    result = await Promise.all([
      connection.execute(`
        SELECT *
        FROM squads
        WHERE date BETWEEN 'start_date' AND 'end_date';
      `),
      connection.execute(`
        SELECT COUNT(*) AS total
        FROM tournaments 
        WHERE date BETWEEN 'start_date' AND 'end_date';
      `),
      connection.execute(`
        SELECT faction, COUNT(*) AS count
        FROM squads
        WHERE date BETWEEN 'start_date' AND 'end_date'
        GROUP BY faction;
      `),
    ]);
  } catch {
    throw new Error(`Failed to fetch squads...`);
  }

  const squads = (result[0].rows as SquadRow[]).map(squad => ({
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

  const tournaments = result[1].rows[0] as { total: string };

  const count = (
    result[2].rows as { faction: XWSFaction | 'unknown'; count: string }[]
  ).reduce(
    (o, { faction, count }) => {
      o[faction] = Number(count);
      return o;
    },
    {
      all: squads.length,
      rebelalliance: 0,
      galacticempire: 0,
      scumandvillainy: 0,
      resistance: 0,
      firstorder: 0,
      galacticrepublic: 0,
      separatistalliance: 0,
      unknown: 0,
    }
  );

  return {
    squads,
    meta: {
      tournaments: Number(tournaments.total),
      count,
    },
  };
};
