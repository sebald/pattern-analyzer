import { useMemo } from 'react';

import type { SquadData } from '@/lib/types';
import { setup } from './setup';
import {
  composition,
  faction,
  pilot,
  pilotCostDistribution,
  pilotSkillDistribution,
  ship,
  squadSize,
  upgrade,
} from './module';

export interface UseSquadStatsProps {
  squads: SquadData[];
}

export const useSquadStats = ({ squads }: UseSquadStatsProps) => {
  const stats = useMemo(
    () =>
      setup([
        composition,
        faction,
        pilotCostDistribution,
        pilotSkillDistribution,
        pilot,
        ship,
        squadSize,
        upgrade,
      ])(squads),
    [squads]
  );
  return stats;
};
