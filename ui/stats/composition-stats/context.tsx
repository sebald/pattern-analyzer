'use client';

import { createContext, ReactNode, useContext, useState } from 'react';
import { Factions } from '@/lib/get-value';

export type FactionOptions = 'all' | Factions;
export type SortOptions =
  | 'percentile'
  | 'deviation'
  | 'winrate'
  | 'frequency'
  | 'count'
  | 'score';

const Context = createContext<{
  faction: FactionOptions;
  setFaction: (faction: FactionOptions) => void;
  sort: SortOptions;
  setSort: (value: SortOptions) => void;
} | null>(null);

export interface FilterProviderProps {
  children: ReactNode;
}

export const CompositionFilterProvider = ({
  children,
}: FilterProviderProps) => {
  const [faction, setFaction] = useState<FactionOptions>('all');
  const [sort, setSort] = useState<SortOptions>('percentile');

  return (
    <Context.Provider value={{ faction, setFaction, sort, setSort }}>
      {children}
    </Context.Provider>
  );
};

export const useCompositionFilter = () => {
  const context = useContext(Context);

  if (context === null) {
    throw new Error(
      '"useCompositionFilter" must be used within a <CompositionFilterProvider>'
    );
  }

  return context;
};
