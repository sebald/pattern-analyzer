import type { Ships } from '@/lib/get-value';
import type { GameRecord, XWSFaction } from '@/lib/types';
import { average, deviation, round, winrate } from '@/lib/utils/math.utils';

import { magic } from '../magic';
import type { StatModule } from '../types';

// Types
// ---------------
export interface CompositionData {
  composition: {
    [key: string]: {
      ships: Ships[];
      faction: XWSFaction;
      count: number;
      record: GameRecord;
      frequency: number;
      winrate: number | null;
      percentile: number;
      deviation: number;
      score: number;
    };
  };
}

interface Data {
  ships: Ships[];
  faction: XWSFaction;
  count: number;
  record: GameRecord;
  percentiles: number[];
}

type Store = {
  [key: string]: Data;
};

// Helper
// ---------------
const init = (ships: Ships[], faction: XWSFaction): Data => ({
  ships,
  faction,
  count: 0,
  record: { wins: 0, ties: 0, losses: 0 },
  percentiles: [],
});

// Module
// ---------------
export const composition: () => StatModule<CompositionData> = () => {
  const store: Store = {};

  return {
    xws: (xws, { faction, record, rank, percentile, tournament }) => {
      const ships = xws.pilots.map(({ ship }) => ship);
      ships.sort();
      const id = ships.join('.');

      const item = store[id] || init(ships, faction);

      item.count += 1;
      item.record.wins += record.wins;
      item.record.ties += record.ties;
      item.record.losses += record.losses;
      item.percentiles.push(percentile);

      store[id] = item;
    },
    get: ({ tournament, config }) => {
      const result: CompositionData = {
        composition: {},
      };

      Object.entries(store).forEach(([id, item]) => {
        const stat = {
          count: item.count,
          percentile: average(item.percentiles, 4),
          deviation: deviation(item.percentiles, 4),
        };
        const score = magic(stat);

        // Skip small sample sizes
        if (config.smallSamples === false && (stat.count < 3 || score < 5)) {
          return;
        }

        result.composition[id] = {
          ships: item.ships,
          faction: item.faction,
          count: item.count,
          record: item.record,
          frequency: round(item.count / tournament.count[item.faction], 4),
          percentile: stat.percentile,
          deviation: stat.deviation,
          winrate: winrate([item.record]),
          score,
        };
      });

      return result;
    },
  };
};
