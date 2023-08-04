import { Client, ExecutedQuery } from '@planetscale/database';

import { pointsUpdateDate } from '@/lib/config';
import type { GameRecord, SquadData, XWSFaction, XWSSquad } from '@/lib/types';
import { toDate, today } from '@/lib/utils/date.utils';
import { percentile } from '@/lib/utils';
import { toCompositionId } from '@/lib/xws';

// Config
// ---------------
const client = new Client({
  url: process.env.DATABASE_URL,
});

// Helper
// ---------------
const between = (from?: Date, to?: Date) =>
  `BETWEEN '${from ? toDate(from) : pointsUpdateDate}' AND '${toDate(
    to || today()
  )}'`;

// Types
// ---------------
interface SquadRow {
  id: number;
  listfortress_ref: number;
  composition: string | null;
  faction: XWSFaction | 'unknown';
  player: string;
  date: string;
  xws: XWSSquad;
  wins: number;
  ties: number;
  losses: number;
  swiss: number;
  cut: number | null;
  percentile: string;
}

export interface SquadEntitiy {
  id: number;
  player: string;
  date: Date;
  rank: {
    swiss: number;
    elimination: number | null;
  };
  record: GameRecord;
  xws: XWSSquad | null;
  faction: XWSFaction | 'unknown';
  composition: string | null;
  percentile: number;
}

export interface DatabaseFilter {
  /**
   * Tournaments occured at or after given date.
   */
  from?: Date;
  /**
   * Tournaments occured at or before given date.
   */
  to?: Date;
}

// Tournaments
// ---------------
export const getTournaments = async ({ from, to }: DatabaseFilter) => {
  const connection = client.connection();
  let result: ExecutedQuery;

  try {
    result = await connection.execute(`
      SELECT listfortress_ref AS id, name, date
      FROM tournaments 
      WHERE date ${between(from, to)};
    `);
  } catch {
    throw new Error(`Failed to fetch tournaments...`);
  }

  return result.rows as { id: number; name: string; date: string }[];
};

export const getTournamentsInfo = async ({ from, to }: DatabaseFilter) => {
  const connection = client.connection();
  let result: ExecutedQuery;

  try {
    result = await connection.execute(`
      SELECT
        (SELECT COUNT(*) 
        FROM tournaments 
        WHERE date ${between(from, to)})
          AS count_tournaments,
        (SELECT COUNT(*) 
        FROM squads 
        WHERE date ${between(from, to)}) 
          AS count_squads;
    `);
  } catch {
    throw new Error(`Failed to fetch tournament info...`);
  }

  const { count_tournaments, count_squads } = result.rows[0] as any;

  return {
    count: {
      tournament: Number(count_tournaments),
      squads: Number(count_squads),
    },
  };
};

// Squads
// ---------------
export const getSquads = async ({ from, to }: DatabaseFilter) => {
  const connection = client.connection();
  let result: [
    squads: ExecutedQuery,
    meta: ExecutedQuery,
    tournaments: ExecutedQuery
  ];

  try {
    result = await Promise.all([
      connection.execute(`
        SELECT *
        FROM squads
        WHERE date ${between(from, to)};
      `),
      connection.execute(`
        SELECT COUNT(*) AS total
        FROM tournaments 
        WHERE date ${between(from, to)};
      `),
      connection.execute(`
        SELECT faction, COUNT(*) AS count
        FROM squads
        WHERE date ${between(from, to)}
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
