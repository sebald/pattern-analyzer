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
export interface SquadModuleContext {
  faction: XWSFaction | 'unknown';
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

export interface StatModule<T> {
  /**
   * Gets the whole squad, can do whatever.
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
  get: (ctx: { total: number }) => T;
}

export interface TournamentStats {
  count: number;
  xws: number;
  cut: number;
}

// Factory
// ---------------
export const factory = <T = any>(modules: StatModule<any>[]) => {
  const hooks = {
    squad: (squad: SquadData, ctx: SquadModuleContext) =>
      modules.forEach(m => m.squad?.(squad, ctx)),
    xws: (xws: XWSSquad, ctx: XWSModuleContext) =>
      modules.forEach(m => m.xws?.(xws, ctx)),
    pilot: (pilot: XWSPilot, ctx: XWSModuleContext) =>
      modules.forEach(m => m.pilot?.(pilot, ctx)),
    ship: (ship: Ships, ctx: XWSModuleContext) =>
      modules.forEach(m => m.ship?.(ship, ctx)),
    upgrade: (upgrade: string, slot: XWSUpgradeSlots, ctx: XWSModuleContext) =>
      modules.forEach(m => m.upgrade?.(upgrade, slot, ctx)),
  };

  return (data: SquadData[]) => {
    const tournament: TournamentStats = {
      count: data.length,
      xws: 0,
      cut: 0,
    };

    data.forEach(item => {
      // Setup context for hooks.
      const cache = new Set<string>();
      const faction = item.xws ? item.xws.faction : 'unknown';
      const unique = (val: string) => cache.has(val);

      if (item.xws) {
        tournament.xws += 1;
      }
      if (item.rank.elimination) {
        tournament.cut += 1;
      }

      // HOOK: Squads
      hooks.squad(item, {
        faction,
        rank: item.rank,
        record: item.record,
        unique,
      });

      if (item.xws && faction !== 'unknown') {
        const ctx = {
          faction,
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
      ...modules.reduce(
        (o, m) => ({ o, ...m.get({ total: data.length }) }),
        {}
      ),
    } as T & { tournament: TournamentStats };
  };
};