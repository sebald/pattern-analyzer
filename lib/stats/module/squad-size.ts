import { StatModule } from '../setup';

// Types
// ---------------
export interface SquadSizeData {
  squadSize: {
    [Size in 3 | 4 | 5 | 6 | 7 | 8]: number;
  };
}

// Module
// ---------------
export const squadSize: () => StatModule<SquadSizeData> = () => {
  const store = {
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
  };

  return {
    xws: ({ pilots }) => {
      const num = pilots.length as 3 | 4 | 5 | 6 | 7 | 8;
      store[num] += 1;
    },
    get: () => ({ squadSize: store }),
  };
};
