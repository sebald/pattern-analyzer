import type { Ships } from '@/lib/get-value';
import type { GameRecord } from '@/lib/types';

export interface PilotStatsType {
  ship: Ships;
  count: number;
  lists: number;
  record: GameRecord;
  frequency: number;
  winrate: number | null;
  percentile: number;
  deviation: number;
  score: number;
}
