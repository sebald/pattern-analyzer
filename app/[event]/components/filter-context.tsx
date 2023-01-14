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
} | null>(null);

export interface FilterProviderProps {
  children: ReactNode;
}

export const FilterProvider = ({ children }: FilterProviderProps) => {
  const [faction, setFaction] = useState<FactionOptions>('all');
  return (
    <Context.Provider value={{ faction, setFaction }}>
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
