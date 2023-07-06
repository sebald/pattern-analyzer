'use client';

import { createContext, ReactNode, useContext, useState } from 'react';
import { Factions } from '@/lib/get-value';

export type FactionOptions = 'all' | Factions;

const Context = createContext<{
  faction: FactionOptions;
  setFaction: (faction: FactionOptions) => void;
  query: string;
  setQuery: (query: string) => void;
} | null>(null);

export interface FilterProviderProps {
  children: ReactNode;
}

export const FilterProvider = ({ children }: FilterProviderProps) => {
  const [faction, setFaction] = useState<FactionOptions>('all');
  const [query, setQuery] = useState<string>('');
  return (
    <Context.Provider value={{ faction, setFaction, query, setQuery }}>
      {children}
    </Context.Provider>
  );
};

export const useFilter = () => {
  const context = useContext(Context);

  if (context === null) {
    throw new Error('"useFilter" must be used within a <FilterProvider>');
  }

  return context;
};
