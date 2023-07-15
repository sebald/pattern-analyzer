import type { Ships } from '@/lib/get-value';
import type { XWSFaction, GameRecord, XWSUpgradeSlots } from '@/lib/types';

// Maps
// ---------------
export type FactionMap<Key extends string, Value> = {
  [faction in XWSFaction]: { [key in Key]?: Value };
};

export type FactionMapWithAll<Key extends string, Value> = {
  [faction in XWSFaction | 'all']: { [key in Key]?: Value };
};
