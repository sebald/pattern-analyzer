import { StatModule } from '../types';

// Types
// ---------------
export interface PilotCostDistributionData {
  pilotCostDistribution: {
    [Size in 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9]: number;
  };
}

// Module
// ---------------
export const pilotCostDistribution: () => StatModule<PilotCostDistributionData> =
  () => {
    const store = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
      7: 0,
      8: 0,
      9: 0,
    };

    return {
      pilot: pilot => {
        const points = pilot.points as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
        if (isNaN(points) || points < 0 || points > 9) {
          // DEBUG: This happens a lot so we leave this here...
          // console.log(pilot.id, points);
          return;
        }
        store[points] += 1;
      },
      get: () => ({ pilotCostDistribution: store }),
    };
  };
