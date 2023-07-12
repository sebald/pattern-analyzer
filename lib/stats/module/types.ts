// Stats
// ---------------
export interface PerformanceStats {
  percentile: number;
  deviation: number;
  winrate: number | null;
}

export interface FrequencyStats {
  frequency: number;
}

export interface ScoreStats {
  score: number;
}
