import type { Ships } from '@/lib/get-value';
import type { GameRecord, XWSFaction } from '@/lib/types';
import {
  average,
  deviation,
  percentile,
  round,
  winrate,
} from '@/lib/utils/math.utils';

import { magic } from '../magic';
import type { FactionMap } from '../types';
import type { StatModule } from '../setup';

// Types
// ---------------
export interface PilotData {
  pilot: FactionMap<
    string,
    {
      ship: Ships;
      count: number;
      lists: number;
      record: GameRecord;
      frequency: number;
      winrate: number | null;
      percentile: number;
      deviation: number;
      score: number;
    }
  >;
}

interface Data {
  ship: Ships;
  count: number;
  lists: number;
  record: GameRecord;
  percentiles: number[];
}

type Store = {
  [Faction in XWSFaction]: { [pilot: string]: Data };
};

// Helper
// ---------------
const init = (ship: Ships): Data => ({
  ship,
  count: 0,
  lists: 0,
  record: { wins: 0, ties: 0, losses: 0 },
  percentiles: [],
});

// Module
// ---------------
export const pilot: () => StatModule<PilotData> = () => {
  const store: Store = {
    rebelalliance: {},
    galacticempire: {},
    scumandvillainy: {},
    resistance: {},
    firstorder: {},
    galacticrepublic: {},
    separatistalliance: {},
  };

  return {
    pilot: (pilot, { faction, record, rank, unique, tournament }) => {
      const item = store[faction][pilot.id] || init(pilot.ship);

      item.count += 1;
      item.record.wins += record.wins;
      item.record.ties += record.ties;
      item.record.losses += record.losses;
      item.percentiles.push(
        percentile(rank.elimination ?? rank.swiss, tournament.count.all)
      );

      if (!unique(pilot.id)) {
        item.lists += 1;
      }

      store[faction][pilot.id] = item;
    },
    get: ({ tournament, config }) => {
      const result: PilotData = {
        pilot: {
          rebelalliance: {},
          galacticempire: {},
          scumandvillainy: {},
          resistance: {},
          firstorder: {},
          galacticrepublic: {},
          separatistalliance: {},
        },
      };

      Object.keys(store).forEach(key => {
        const fid = key as XWSFaction;

        Object.entries(store[fid]).forEach(([pid, item]) => {
          const stat = {
            count: item.count,
            percentile: average(item.percentiles, 4),
            deviation: deviation(item.percentiles, 4),
          };
          const score = magic(stat);

          // Skip small sample sizes
          if (config.smallSamples === false && (stat.count < 5 || score < 5)) {
            return;
          }

          result.pilot[fid][pid] = {
            ship: item.ship,
            count: item.count,
            lists: item.lists,
            record: item.record,
            frequency: round(item.lists / tournament.count[fid], 4),
            percentile: stat.percentile,
            deviation: stat.deviation,
            winrate: winrate([item.record]),
            score,
          };
        });
      });

      return result;
    },
  };
};
