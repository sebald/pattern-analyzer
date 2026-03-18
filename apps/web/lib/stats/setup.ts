import type { SquadEntitiy } from '@/lib/db/types';
import type { Ships } from '@/lib/get-value';
import type { XWSPilot, XWSSquad, XWSUpgradeSlots } from '@/lib/types';
import { isStandardized, toFaction } from '@/lib/xws';
import type {
  StatModule,
  StatsConfig,
  SquadModuleContext,
  XWSModuleContext,
} from './types';

// Types
// ---------------

// Factory
// ---------------
export const setup =
  <T = any>(modules: (() => StatModule<any>)[]) =>
  (squads: SquadEntitiy[], config: StatsConfig) => {
    const plugins = modules.map(m => m());
    // Data about the tournaments the squads were run
    const tournament: SquadModuleContext['tournament'] = {
      total: config.tournaments,
      count: config.count,
      xws: config.count.all - config.count.unknown,
      cut: 0,
    };

    squads.forEach(current => {
      const hooks = {
        squad: (squad: SquadEntitiy, ctx: SquadModuleContext) =>
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

      // Setup context for hooks.
      const cache = new Set<string>();
      const faction =
        // @ts-expect-error (the faction can be "all" in epic)
        current.xws && current.xws.faction !== 'all'
          ? toFaction(current.xws.faction)
          : 'unknown';
      const unique = (val: string) => cache.has(val);

      if (current.rank.elimination) {
        tournament.cut += 1;
      }

      // HOOK: Squads
      hooks.squad(current, {
        faction,
        tournament,
        rank: current.rank,
        record: current.record,
        percentile: current.percentile,
        unique,
      });

      if (current.xws && faction !== 'unknown') {
        const ctx = {
          faction,
          tournament,
          rank: current.rank,
          record: current.record,
          percentile: current.percentile,
          unique,
        };

        // HOOK: XWS
        hooks.xws(current.xws, ctx);

        current.xws.pilots.forEach(pilot => {
          // HOOK: Pilot
          hooks.pilot(pilot, ctx);
          cache.add(pilot.id);

          // HOOK: Ship
          hooks.ship(pilot.ship, ctx);
          cache.add(pilot.ship);

          // Ignore Upgrades from Standarizes Cards
          if (!isStandardized(pilot.id)) {
            (
              Object.entries(pilot.upgrades) as [XWSUpgradeSlots, string[]][]
            ).forEach(([slot, upgrades]) => {
              upgrades.forEach(upgrade => {
                // HOOK: Upgrade
                hooks.upgrade(upgrade, slot, ctx);
                cache.add(upgrade);
              });
            });
          }
        });
      }
    });

    return {
      ...plugins.reduce(
        (o, p) => ({ ...o, ...p.get({ tournament, config }) }),
        {}
      ),
    } as T;
  };
