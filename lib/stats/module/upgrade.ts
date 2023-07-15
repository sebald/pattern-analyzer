import {
  average,
  deviation,
  percentile,
  round,
  winrate,
} from '@/lib/utils/math.utils';
import type { GameRecord, XWSFaction, XWSUpgradeSlots } from '@/lib/types';

import { magic } from '../magic';
import type { FactionMapWithAll, StatModule } from '../types';

// Types
// ---------------
export interface UpgradeData {
  upgrade: FactionMapWithAll<
    string,
    {
      slot: XWSUpgradeSlots;
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
  slot: XWSUpgradeSlots;
  count: number;
  lists: number;
  record: GameRecord;
  percentiles: number[];
}

type Store = {
  [Faction in XWSFaction | 'all']: { [upgrade: string]: Data };
};

// Helper
// ---------------
const init = (slot: XWSUpgradeSlots): Data => ({
  slot,
  count: 0,
  lists: 0,
  record: { wins: 0, ties: 0, losses: 0 },
  percentiles: [],
});

// Module
// ---------------
export const upgrade: () => StatModule<UpgradeData> = () => {
  const store: Store = {
    all: {},
    rebelalliance: {},
    galacticempire: {},
    scumandvillainy: {},
    resistance: {},
    firstorder: {},
    galacticrepublic: {},
    separatistalliance: {},
  };

  return {
    upgrade: (upgrade, slot, { faction, record, rank, unique, tournament }) => {
      // Updage overall
      let item = store['all'][upgrade] || init(slot);

      item.count += 1;
      item.record.wins += record.wins;
      item.record.ties += record.ties;
      item.record.losses += record.losses;
      item.percentiles.push(
        percentile(rank.elimination ?? rank.swiss, tournament.count.all)
      );

      if (!unique(upgrade)) {
        item.lists += 1;
      }

      store['all'][upgrade] = item;

      // Upgrade for faction
      item = store[faction][upgrade] || init(slot);

      item.count += 1;
      item.record.wins += record.wins;
      item.record.ties += record.ties;
      item.record.losses += record.losses;
      item.percentiles.push(
        percentile(rank.elimination ?? rank.swiss, tournament.count.all)
      );

      if (!unique(upgrade)) {
        item.lists += 1;
      }

      store[faction][upgrade] = item;
    },
    get: ({ tournament, config }) => {
      const result: UpgradeData = {
        upgrade: {
          all: {},
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
        const fid = key as XWSFaction | 'all';

        Object.entries(store[fid]).forEach(([uid, item]) => {
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

          result.upgrade[fid][uid] = {
            slot: item.slot,
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
