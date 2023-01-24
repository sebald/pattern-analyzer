'use client';

import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from 'react';
import type { FactionOptions } from 'lib/types';

const Context = createContext<{
  faction: FactionOptions;
  setFaction: Dispatch<SetStateAction<FactionOptions>>;
  query: string;
  setQuery: Dispatch<SetStateAction<string>>;
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
