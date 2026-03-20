import type { XWSUpgradeSlots } from '@pattern-analyzer/xws/types';
import type { GameRecord } from '@/lib/types';

export interface UpgradeStatsType {
  slot: XWSUpgradeSlots;
  count: number;
  lists: number;
  record: GameRecord;
  frequency: number;
  winrate: number | null;
  percentile: number;
  deviation: number;
  score: number;
}
