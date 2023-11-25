import type { XWSSquad, GameRecord } from '@/lib/types';

export interface SquadStatData {
  /**
   * Pilot ids separated by "."
   */
  id: string;
  tournamentId: number;
  player: string;
  date: string;
  xws: XWSSquad;
  percentile: number;
  record: GameRecord;
  rank: {
    swiss: number;
    elimination?: number;
  };
}
