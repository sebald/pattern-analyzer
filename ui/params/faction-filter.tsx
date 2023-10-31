'use client';

import { XWSFaction } from '@/lib/types';
import { FactionSelection } from '@/ui/faction-selection';

import { useParams } from './useParams';

// Hook
// ---------------
export const useFactionFilter = () => {
  const [filter, setFilter] = useParams(['faction']);

  const setFaction = (faction: XWSFaction | 'all') => {
    setFilter({
      faction: faction !== 'all' ? faction : null,
    });
  };

  const faction = (filter.faction || 'all') as XWSFaction | 'all';

  return [faction, setFaction] as const;
};

// Component
// ---------------
export const FactionFilter = () => {
  const [faction, setFaction] = useFactionFilter();
  return <FactionSelection value={faction} onChange={setFaction} allowAll />;
};
