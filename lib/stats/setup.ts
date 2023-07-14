import type { Ships } from '@/lib/get-value';
import type {
  GameRecord,
  SquadData,
  XWSFaction,
  XWSPilot,
  XWSSquad,
  XWSUpgradeSlots,
} from '@/lib/types';

// Types
// ---------------
export interface TournamentStats {
  count: { [Faction in XWSFaction | 'unknown' | 'all']: number };
  xws: number;
  cut: number;
}

export interface SquadModuleContext {
  faction: XWSFaction | 'unknown';
  tournament: TournamentStats;
  rank: {
    swiss: number;
    elimination?: number;
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
}

export interface StatModule<T> {
  /**
   * Gets the whole squad, can do whatever.
   * At this point the squad might not have a valid XWS!
   */
  squad?: (squad: SquadData, ctx: SquadModuleContext) => void;
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
  get: (ctx: { tournament: TournamentStats; config: StatsConfig }) => T;
}

// Factory
// ---------------
export const setup =
  <T = any>(modules: (() => StatModule<any>)[], config: StatsConfig = {}) =>
  (data: SquadData[]) => {
    const plugins = modules.map(m => m());

    const hooks = {
      squad: (squad: SquadData, ctx: SquadModuleContext) =>
        plugins.forEach(p => p.squad?.(squad, ctx)),
      xws: (xws: XWSSquad, ctx: XWSModuleContext) =>
        plugins.forEach(p => p.xws?.(xws, ctx)),
      pilot: (pilot: XWSPilot, ctx: XWSModuleContext) =>
        plugins.forEach(p => p.pilot?.(pilot, ctx)),
      ship: (ship: Ships, ctx: XWSModuleContext) =>
        plugins.forEach(p => p.ship?.(ship, ctx)),
      upgrade: (
        upgrade: string,
        slot: XWSUpgradeSlots,
        ctx: XWSModuleContext
      ) => plugins.forEach(p => p.upgrade?.(upgrade, slot, ctx)),
    };

    const tournament: TournamentStats = {
      count: {
        all: data.length,
        rebelalliance: 0,
        galacticempire: 0,
        scumandvillainy: 0,
        resistance: 0,
        firstorder: 0,
        galacticrepublic: 0,
        separatistalliance: 0,
        unknown: 0,
      },
      xws: 0,
      cut: 0,
    };

    data.forEach(item => {
      // Setup context for hooks.
      const cache = new Set<string>();
      const faction = item.xws ? item.xws.faction : 'unknown';
      const unique = (val: string) => cache.has(val);

      tournament.count[faction] += 1;

      if (item.xws) {
        tournament.xws += 1;
      }
      if (item.rank.elimination) {
        tournament.cut += 1;
      }

      // HOOK: Squads
      hooks.squad(item, {
        faction,
        tournament,
        rank: item.rank,
        record: item.record,
        unique,
      });

      if (item.xws && faction !== 'unknown') {
        const ctx = {
          faction,
          tournament,
          rank: item.rank,
          record: item.record,
          unique,
        };

        // HOOK: XWS
        hooks.xws(item.xws, ctx);

        item.xws.pilots.forEach(pilot => {
          // HOOK: Pilot
          hooks.pilot(pilot, ctx);
          cache.add(pilot.id);

          // HOOK: Ship
          hooks.ship(pilot.ship, ctx);
          cache.add(pilot.ship);

          (
            Object.entries(pilot.upgrades) as [XWSUpgradeSlots, string[]][]
          ).forEach(([slot, upgrades]) => {
            upgrades.forEach(upgrade => {
              // HOOK: Upgrade
              hooks.upgrade(upgrade, slot, ctx);
              cache.add(upgrade);
            });
          });
        });
      }
    });

    return {
      tournament,
      ...plugins.reduce(
        (o, p) => ({ o, ...p.get({ tournament, config }) }),
        {}
      ),
    } as T & { tournament: TournamentStats };
  };
