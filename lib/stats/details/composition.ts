import type { Ships } from '@/lib/get-value';
import type { GameRecord, SquadData, XWSFaction, XWSSquad } from '@/lib/types';
import { toMonth } from '@/lib/utils/date.utils';
import {
  average,
  deviation,
  percentile,
  round,
  winrate,
} from '@/lib/utils/math.utils';

// Types
// ---------------
export interface SquadCompositionData {
  /**
   * Composition id (ships separated by ".")
   */
  id: string;
  faction: XWSFaction;
  count: number;
  record: GameRecord;
  percentiles: number[];

  pilot: {
    [id: string]: {
      count: number;
      record: GameRecord;
      percentiles: number[];
    };
  };

  squads: {
    /**
     * Pilot ids separated by "."
     */
    id: string;
    player: string;
    xws: XWSSquad;
    event: {
      date: string;
      total: number;
      rank: {
        swiss: number;
        elimination?: number;
      };
    };
  }[];
}

export interface SquadCompositionStats {
  id: string;
  faction: XWSFaction;
  ships: Ships[];
  count: number;
  frequency: number;
  winrate: number | null;
  percentile: number;
  deviation: number;

  trend: {
    date: string;
    count: number;
    percentile: number;
  }[];

  pilot: {
    [id: string]: {
      count: number;
      frequency: number;
      winrate: number | null;
      percentile: number;
      deviation: number;
    };
  };
}

// Helpers
// ---------------
const isComposition = (id: string, xws: XWSSquad) => {
  const ships = xws.pilots.map(p => p.ship);
  ships.sort();
  return id === ships.join('.');
};

// Module
// ---------------
export const compositionDetails = (
  id: string,
  input: { date: string; squads: SquadData[] }[]
) => {
  const stats: SquadCompositionData = {
    id,
    faction: 'rebelalliance', // just so TS shuts up
    squads: [],
    count: 0,
    record: { wins: 0, ties: 0, losses: 0 },
    percentiles: [],
    pilot: {},
  };

  let squadsInFaction = 0;

  input.forEach(({ date, squads }) => {
    const total = squads.length;

    squads.forEach(current => {
      if (!current.xws) return;

      const faction = current.xws.faction;
      squadsInFaction += 1;

      if (!isComposition(id, current.xws)) return;

      const pct = percentile(
        current.rank.elimination ?? current.rank.swiss,
        total
      );

      // Overall stats
      stats.faction = faction;
      stats.count += 1;
      stats.record.wins += current.record.wins;
      stats.record.ties += current.record.ties;
      stats.record.losses += current.record.losses;
      stats.percentiles.push(pct);

      stats.squads.push({
        id: current.xws.pilots.map(({ id }) => id).join('.'),
        player: current.player,
        xws: current.xws,
        event: {
          total,
          date,
          rank: current.rank,
        },
      });

      // Stats based on pilot
      current.xws.pilots.forEach(({ id: pid }) => {
        const pilot = stats.pilot[pid] || {
          count: 0,
          record: { wins: 0, ties: 0, losses: 0 },
          percentiles: [],
        };

        pilot.count += 1;
        pilot.record.wins += current.record.wins;
        pilot.record.ties += current.record.ties;
        pilot.record.losses += current.record.losses;
        pilot.percentiles.push(pct);

        stats.pilot[pid] = pilot;
      });
    });
  });

  // Overall
  const result: SquadCompositionStats = {
    id: stats.id,
    faction: stats.faction,
    ships: stats.id.split('.') as Ships[],
    count: stats.count,
    frequency: round(stats.count / squadsInFaction, 4),
    winrate: winrate([stats.record]),
    percentile: average(stats.percentiles, 4),
    deviation: deviation(stats.percentiles, 4),
    trend: [],
    pilot: {},
  };

  // Trend
  const trends: { [month: string]: { count: number; percentiles: number[] } } =
    {};
  stats.squads.forEach(({ event }) => {
    const month = toMonth(event.date);
  });

  // Pilots
  Object.entries(stats.pilot).forEach(([pid, pilot]) => {
    result.pilot[pid] = {
      count: pilot.count,
      frequency: round(pilot.count / stats.count, 4),
      winrate: winrate([pilot.record]),
      percentile: average(pilot.percentiles, 4),
      deviation: deviation(pilot.percentiles, 4),
    };
  });

  // TODO: group suqads by pilots?

  return result;
};
