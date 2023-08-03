import type { SquadEntitiy } from '@/lib/db';
import type { Ships } from '@/lib/get-value';
import type {
  XWSFaction,
  GameRecord,
  XWSUpgradeSlots,
  XWSPilot,
  XWSSquad,
} from '@/lib/types';
import type { BaseData } from './module/base';

// Maps
// ---------------
export type FactionMap<Key extends string, Value> = {
  [faction in XWSFaction]: { [key in Key]?: Value };
};

export type FactionMapWithAll<Key extends string, Value> = {
  [faction in XWSFaction | 'all']: { [key in Key]?: Value };
};

// Modules
// ---------------
export interface SquadModuleContext {
  faction: XWSFaction | 'unknown';
  tournament: {
    total: number;
    count: { [Faction in XWSFaction | 'unknown' | 'all']: number };
    xws: number;
    cut: number;
  };
  rank: {
    swiss: number;
    elimination: number | null;
  };
  record: GameRecord;
  /**
   * Check for duplicated pilots (a.k.a. generics) and upgrades
   */
  unique: (val: string) => boolean;
}

export interface XWSModuleContext extends Omit<SquadModuleContext, 'faction'> {
  faction: XWSFaction;
}

export interface StatsConfig {
  smallSamples?: boolean;
  tournaments: number;
  count: {
    [Key in XWSFaction | 'all' | 'unknown']: number;
  };
}

export interface BaseModule<T> {
  /**
   * Gets only the current tournament, no context.
   */
  add: (tournament: SquadModuleContext['tournament']) => void;
  /**
   * Returns the stats
   */
  get: (config: StatsConfig) => T;
}

export interface StatModule<T> {
  /**
   * Gets the whole squad, can do whatever.
   * At this point the squad might not have a valid XWS!
   */
  squad?: (squad: SquadEntitiy, ctx: SquadModuleContext) => void;
  /**
   * Gets the squad's XWS
   */
  xws?: (xws: XWSSquad, ctx: XWSModuleContext) => void;
  /**
   * Gets every pilot of the squad
   */
  pilot?: (pilot: XWSPilot, ctx: XWSModuleContext) => void;
  /**
   * Gets every ship of the squad
   */
  ship?: (ship: Ships, ctx: XWSModuleContext) => void;
  /**
   * Gets every upgrade of very pilot in the squad
   */
  upgrade?: (
    upgrade: string,
    slot: XWSUpgradeSlots,
    ctx: XWSModuleContext
  ) => void;
  /**
   * Returns the stats
   */
  get: (ctx: {
    tournament: SquadModuleContext['tournament'];
    config: StatsConfig;
  }) => T;
}
