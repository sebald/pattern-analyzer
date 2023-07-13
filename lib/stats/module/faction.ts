import type { GameRecord, XWSFaction } from '@/lib/types';
import type { StatModule } from './factory';
import {
  average,
  deviation,
  percentile,
  round,
  winrate,
} from '@/lib/utils/math.utils';

// Types
// ---------------
export interface FactionData {
  faction: {
    [Faction in XWSFaction | 'unknown']: {
      count: number;
      /**
       * Best placedment in a tournment (= max(...ranks))
       */
      top: number;
      record: GameRecord;
      frequency: number;
      winrate: number | null;
      percentile: number;
      deviation: number;
    };
  };
}

interface Data {
  count: number;
  top: number;
  record: GameRecord;
  percentiles: number[];
}

type Store = {
  [Faction in XWSFaction | 'unknown']: Data;
};

// Helper
// ---------------
const init = (): Data => ({
  count: 0,
  record: { wins: 0, ties: 0, losses: 0 },
  top: 1000, // Use a high number to initialize 🤷‍♂️
  percentiles: [],
});

// Module
// ---------------
export const faction: () => StatModule<FactionData> = () => {
  const store: Store = {
    rebelalliance: init(),
    galacticempire: init(),
    scumandvillainy: init(),
    resistance: init(),
    firstorder: init(),
    galacticrepublic: init(),
    separatistalliance: init(),
    unknown: init(),
  };

  return {
    squad: (squad, { faction: fid, record, tournament }) => {
      const rank = squad.rank.elimination ?? squad.rank.swiss;

      store[fid].count += 1;
      store[fid].record.wins += record.wins;
      store[fid].record.ties += record.ties;
      store[fid].record.losses += record.losses;
      store[fid].percentiles.push(percentile(rank, tournament.count.total));

      if (rank < store[fid].top) {
        store[fid].top = rank;
      }
    },
    get: ({ tournament }) => {
      const result = {
        faction: {
          rebelalliance: {},
          galacticempire: {},
          scumandvillainy: {},
          resistance: {},
          firstorder: {},
          galacticrepublic: {},
          separatistalliance: {},
          unknown: {},
        },
      } as FactionData;

      Object.keys(store).forEach(key => {
        const fid = key as XWSFaction | 'unknown';
        const data = store[fid];

        result.faction[fid].count = data.count;
        result.faction[fid].top = data.top;
        result.faction[fid].record = data.record;

        result.faction[fid].frequency = round(
          data.count / tournament.count.total,
          4
        );
        result.faction[fid].percentile = average(data.percentiles, 4);
        result.faction[fid].deviation = deviation(data.percentiles, 4);
        result.faction[fid].winrate = winrate([data.record]);
      });

      return result;
    },
  };
};
