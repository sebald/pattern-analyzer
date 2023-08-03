import type { Ships } from '@/lib/get-value';
import type {
  SquadData,
  XWSPilot,
  XWSSquad,
  XWSUpgradeSlots,
} from '@/lib/types';
import { base, BaseData } from './module/base';
import type {
  StatModule,
  StatsConfig,
  SquadModuleContext,
  XWSModuleContext,
} from './types';
import { isStandardized } from '../xws';

// Types
// ---------------

// Factory
// ---------------
export const setup =
  <T = any>(modules: (() => StatModule<any>)[]) =>
  (list: SquadData[][], config: StatsConfig = {}) => {
    const basePlugin = base();
    const plugins = modules.map(m => m());

    list.forEach(data => {
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

      const tournament: SquadModuleContext['tournament'] = {
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

      // Single Tournament
      data.forEach(current => {
        // Setup context for hooks.
        const cache = new Set<string>();
        const faction = current.xws ? current.xws.faction : 'unknown';
        const unique = (val: string) => cache.has(val);

        tournament.count[faction] += 1;

        if (current.xws) {
          tournament.xws += 1;
        }
        if (current.rank.elimination) {
          tournament.cut += 1;
        }

        // HOOK: Squads
        hooks.squad(current, {
          faction,
          tournament,
          rank: current.rank,
          record: current.record,
          unique,
        });

        if (current.xws && faction !== 'unknown') {
          const ctx = {
            faction,
            tournament,
            rank: current.rank,
            record: current.record,
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

            (
              Object.entries(pilot.upgrades) as [XWSUpgradeSlots, string[]][]
            ).forEach(([slot, upgrades]) => {
              upgrades.forEach(upgrade => {
                // Ignore Upgrades from Standarizes Cards
                if (!isStandardized(pilot.id)) {
                  // HOOK: Upgrade
                  hooks.upgrade(upgrade, slot, ctx);
                }
                cache.add(upgrade);
              });
            });
          });
        }
      });
      // "HOOK": Base Plugin
      basePlugin.add(tournament);
    });

    // Get data from base plugin to call other plugins.
    const { tournament } = basePlugin.get(config);

    return {
      tournament,
      ...plugins.reduce(
        (o, p) => ({ ...o, ...p.get({ tournament, config }) }),
        {}
      ),
    } as T & BaseData;
  };
