import type { GameRecord, XWSSquad, XWSFaction } from '@/lib/types';

export interface DateFilter {
  from?: string | Date;
  to?: string | Date;
}

export interface SquadEntitiy {
  id: number;
  player?: string;
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
