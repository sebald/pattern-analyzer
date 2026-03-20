import type { Ships } from '@pattern-analyzer/xws/get-value';
import type { XWSFaction } from '@pattern-analyzer/xws/types';
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
