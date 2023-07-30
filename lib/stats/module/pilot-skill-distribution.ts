import { getPilotSkill } from '@/lib/yasb';
import { StatModule } from '../types';

// Types
// ---------------
export interface PilotSkillDistributionData {
  pilotSkillDistribution: {
    [Size in 0 | 1 | 2 | 3 | 4 | 5 | 6]: number;
  };
}

// Module
// ---------------
export const pilotSkillDistribution: () => StatModule<PilotSkillDistributionData> =
  () => {
    const store = {
      0: 0,
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
    };

    return {
      pilot: pilot => {
        const skill = getPilotSkill(pilot.id);
        // Ignore "Nashtah Pup"
        if (skill === '*') return;
        // DEBUG: This happens a lot so we leave this here...
        // if (isNaN(skill) || !skill || skill < 0 || skill > 6) {
        //   console.log(pilot.id, skill);
        // }
        store[skill] += 1;
      },
      get: () => ({ pilotSkillDistribution: store }),
    };
  };
