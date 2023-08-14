import type { GameRecord, XWSSquad, XWSFaction } from '@/lib/types';

/**
 * Used when a certain input results in certain values are always present.
 * E.g. where x = ..., then x will be present even though the type says it
 * can be undefined.
 */
export type WithProperties<T, Keys extends keyof T> = Omit<T, Keys> & {
  [K in Keys]-?: NonNullable<T[K]>;
};

export interface DateFilter {
  from?: string | Date;
  to?: string | Date;
}

export interface SquadEntitiy {
  id: number;
  player: string;
  date: Date;
  rank: {
    swiss: number;
    elimination?: number;
  };
  record: GameRecord;
  xws?: XWSSquad;
  faction: XWSFaction | 'unknown';
  composition?: string;
  percentile: number;
}
