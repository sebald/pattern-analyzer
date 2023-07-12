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
export interface ModuleContext {
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

export interface StatModule<T> {
  /**
   * Gets the whole squad, can do whatever.
   */
  squad?: (squad: SquadData, ctx: ModuleContext) => void;
  /**
   * Gets the squad's XWS
   */
  xws?: (xws: XWSSquad, ctx: ModuleContext) => void;
  /**
   * Gets every pilot of the squad
   */
  pilot?: (pilot: XWSPilot, ctx: ModuleContext) => void;
  /**
   * Gets every ship of the squad
   */
  ship?: (ship: Ships, ctx: ModuleContext) => void;
  /**
   * Gets every upgrade of very pilot in the squad
   */
  upgrade?: (
    upgrade: string,
    slot: XWSUpgradeSlots,
    ctx: ModuleContext
  ) => void;
  /**
   * Returns the stats
   */
  get: () => T;
}

export interface TournamentStats {
  count: number;
  xws: number;
  cut: number;
}

// Factory
// ---------------
export const factory = (modules: StatModule<any>[]) => {
  const hooks = {
    squad: (squad: SquadData, ctx: ModuleContext) =>
      modules.forEach(m => m.squad?.(squad, ctx)),
    xws: (xws: XWSSquad, ctx: ModuleContext) =>
      modules.forEach(m => m.xws?.(xws, ctx)),
    pilot: (pilot: XWSPilot, ctx: ModuleContext) =>
      modules.forEach(m => m.pilot?.(pilot, ctx)),
    ship: (ship: Ships, ctx: ModuleContext) =>
      modules.forEach(m => m.ship?.(ship, ctx)),
    upgrade: (upgrade: string, slot: XWSUpgradeSlots, ctx: ModuleContext) =>
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
      const ctx: ModuleContext = {
        faction: item.xws ? item.xws.faction : 'unknown',
        rank: item.rank,
        record: item.record,
        unique: (val: string) => cache.has(val),
      };

      if (item.xws) {
        tournament.xws += 1;
      }
      if (item.rank.elimination) {
        tournament.cut += 1;
      }

      // HOOK: Squads
      hooks.squad(item, ctx);

      if (item.xws && ctx.faction !== 'unknown') {
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

    // ???

    return {
      tournament,
      ...modules.reduce((o, m) => ({ o, ...m.get() }), {}),
    };
  };
};
