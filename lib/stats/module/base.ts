import type { XWSFaction } from '@/lib/types';
import { BaseModule } from '../setup';

// Types
// ---------------
export interface BaseData {
  tournament: {
    /**
     * Number of overall squads, per faction/unknown and all
     */
    count: { [faction in XWSFaction | 'all' | 'unknown']: number }
    /**
     * Number of squads that have XWS
     */
    xws: 0,
    /**
     * Number of squads in the cut
     */
    cut: 0,
  }
}

type Store = {
  count: { [faction in XWSFaction | 'all' | 'unknown']: number };
  xws: 0;
  cut: 0;
};

// Module
// ---------------
export const base: () => BaseModule<BaseData> = () => {
  const store: Store = {
    count: {
      all: 0,
      rebelalliance: 0,
      galacticempire: 0,
      scumandvillainy: 0,
      resistance: 0,
      firstorder: 0,
      galacticrepublic: 0,
      separatistalliance: 0,
      unknown: 0,
    },
    xws: 0,
    cut: 0,
  };

  return {
    add: (tournament) => {
      store.xws += tournament.xws;
      store.cut += tournament.cut;

      Object.keys(store.count).forEach(key => {
        const faction = key as XWSFaction | 'all' | 'unknown'
        store.count[faction] = tournament.count[faction];
      })
    },
    get: () => ({ tournament: store }),
  };
};
