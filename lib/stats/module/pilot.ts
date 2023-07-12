import type { Ships } from '@/lib/get-value';
import type { GameRecord } from '@/lib/types';
import type { StatModule } from '../factory';
import type { FactionMap } from '../types';

export interface PilotData {
  pilot: FactionMap<
    string,
    {
      ship: Ships;
      count: number;
      lists: number;
      records: GameRecord[];
      ranks: number[];
      frequency: number;
      winrate: number;
      percentile: number;
      deviation: number;
    }
  >;
}

export const pilot: () => StatModule<PilotData> = () => {
  const data: PilotData['pilot'] = {
    rebelalliance: {},
    galacticempire: {},
    scumandvillainy: {},
    resistance: {},
    firstorder: {},
    galacticrepublic: {},
    separatistalliance: {},
  };

  return {
    pilot(pilot, { faction, record, rank, unique }) {
      const item = data[faction][pilot.id] || {
        count: 0,
        lists: 0,
        ship: pilot.ship,
        records: [],
        ranks: [],
        frequency: 0,
        winrate: 0,
        percentile: 0,
        deviation: 0,
      };
      data[faction][pilot.id] = {
        ...item,
        lists: unique(pilot.id) ? item.lists : item.lists + 1,
        count: item.count + 1,
        records: [...item.records, record],
        ranks: [...item.ranks, rank.elimination ?? rank.swiss],
      };
    },
    get: () => ({
      // TODO: Move calculations from create here
      pilot: data,
    }),
  };
};
