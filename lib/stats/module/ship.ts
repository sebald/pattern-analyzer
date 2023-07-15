import type { Ships } from '@/lib/get-value';
import type { XWSFaction } from '@/lib/types';
import { round } from '@/lib/utils/math.utils';

import type { FactionMap } from '../types';
import type { StatModule } from '../setup';

// Types
// ---------------
export interface ShipData {
  ship: FactionMap<
    Ships,
    {
      count: number;
      lists: number;
      frequency: number;
    }
  >;
}

interface Data {
  count: number;
  lists: number;
}

type Store = {
  [Faction in XWSFaction]: { [ship: string]: Data };
};

// Helper
// ---------------
const init = (): Data => ({
  count: 0,
  lists: 0,
});

// Module
// ---------------
export const ship: () => StatModule<ShipData> = () => {
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
    ship: (ship, { faction, unique }) => {
      const item = store[faction][ship] || init();

      item.count += 1;

      if (!unique(ship)) {
        item.lists += 1;
      }

      store[faction][ship] = item;
    },
    get: ({ tournament }) => {
      const result: ShipData = {
        ship: {
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

        Object.entries(store[fid]).forEach(([sid, item]) => {
          result.ship[fid][sid as Ships] = {
            count: item.count,
            lists: item.lists,
            frequency: round(item.lists / tournament.count[fid], 4),
          };
        });
      });

      return result;
    },
  };
};
