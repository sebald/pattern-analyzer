import type { Ships } from '@/lib/get-value';
import type { GameRecord, SquadData, XWSFaction, XWSSquad } from '@/lib/types';
import { percentile } from '@/lib/utils/math.utils';

// Types
// ---------------
export interface SquadCompositionData {
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
  score: number;
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

  input.forEach(({ date, squads }) => {
    const total = squads.length;

    squads.forEach(current => {
      if (!current.xws) return;
      if (!isComposition(id, current.xws)) return;

      const pct = percentile(
        current.rank.elimination ?? current.rank.swiss,
        total
      );

      // Overall stats
      stats.faction = current.xws.faction;
      stats.count += 1;
      stats.record.wins += current.record.wins;
      stats.record.ties += current.record.ties;
      stats.record.losses += current.record.losses;
      stats.percentiles.push(pct);

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

      stats.squads.push({
        player: current.player,
        xws: current.xws,
        event: {
          total,
          date,
          rank: current.rank,
        },
      });

      // Gather data about each pilot and upgrade
      // count/lists/percentile/deviation

      // "Trend" = percentile 1,2,3 months ago
    });
  });

  const result: SquadCompositionStats = {
    id: stats.id,
    faction: stats.faction,
    ships: stats.id.split('.') as Ships[],
    squads: stats.squads,
    count: stats.count,
    frequency: 0,
    winrate: 0,
    percentile: 0,
    deviation: 0,
    score: 0,
  };

  return result;
};
