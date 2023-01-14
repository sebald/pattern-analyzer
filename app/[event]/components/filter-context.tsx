'use client';

import { Factions } from 'lib/data';
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from 'react';

export type FactionOptions = 'all' | Factions;

const Context = createContext<{
  faction: FactionOptions;
  setFaction: Dispatch<SetStateAction<FactionOptions>>;
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
} | null>(null);

export interface FilterProviderProps {
  children: ReactNode;
}

export const FilterProvider = ({ children }: FilterProviderProps) => {
  const [faction, setFaction] = useState<FactionOptions>('all');
  const [search, setSearch] = useState<string>('');
  return (
    <Context.Provider value={{ faction, setFaction, search, setSearch }}>
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
