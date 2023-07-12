import { StatModule } from '../factory';

export interface SquadSizeData {
  squadSizes: {
    [Size in 3 | 4 | 5 | 6 | 7 | 8]: number;
  };
}

export const squadSizes: () => StatModule<SquadSizeData> = () => {
  const data = {
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
  };

  return {
    xws: xws => {
      const num = xws.pilots.length as 3 | 4 | 5 | 6 | 7 | 8;
      data[num] += 1;
    },
    get: () => ({ squadSizes: data }),
  };
};
