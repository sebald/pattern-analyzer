import { useMemo } from 'react';
import type { SquadData } from '../types';

import { create } from './create';

export interface UseSquadStatsProps {
  squads: SquadData[][];
}

export const useSquadStats = ({ squads }: UseSquadStatsProps) => {
  const stats = useMemo(() => create(squads), [squads]);
  return stats;
};
