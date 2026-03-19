import type { Ships, XWSFaction } from '@pattern-analyzer/xws';
import type { GameRecord } from '@/lib/types';

export interface CompositionStatsType {
  ships: Ships[];
  faction: XWSFaction;
  count: number;
  record: GameRecord;
  frequency: number;
  winrate: number | null;
  percentile: number;
  deviation: number;
  score: number;
}
