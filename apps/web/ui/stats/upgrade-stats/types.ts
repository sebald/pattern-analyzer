import type { XWSUpgradeSlots, GameRecord } from '@/lib/types';

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
