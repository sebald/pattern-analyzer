import { Ships } from '@/lib/get-value';
import type { SquadData, XWSUpgradeSlots } from '@/lib/types';
import { getPilotSkill } from '@/lib/yasb';

import { initCollection } from './init';
import { CompositionDataCollection } from './types';

// Collect data
// ---------------
export const collect = (squads: SquadData[]) => {
  const data = initCollection();
  data.tournament.count = squads.length;

  squads.forEach(squad => {
    // Number of Squads with XWS
    if (squad.xws) {
      data.tournament.xws += 1;
    }

    const faction = squad.xws ? squad.xws.faction : 'unknown';

    // Faction-related stats
    const rank = squad.rank;
    data.faction[faction].count += 1;
    data.faction[faction].ranks.push(rank.elimination ?? rank.swiss);
    data.faction[faction].records.push(squad.record);

    // Update cut size
    if (rank.elimination) {
      data.tournament.cut += 1;
    }

    if (squad.xws && faction !== 'unknown') {
      // Update squad size
      const numPilots = squad.xws.pilots.length as 3 | 4 | 5 | 6 | 7 | 8;
      data.squadSizes[numPilots] += 1;

      // Use to store ships of the squad
      const ships: Ships[] = [];
      // Use to filter duplicated pilots (a.k.a. generics) and upgrades
      const unique = new Set<string>();

      squad.xws.pilots.forEach(pilot => {
        // Add ship
        ships.push(pilot.ship);

        // Pilot stats
        const pilotInfo = data.pilot[faction][pilot.id] || {
          count: 0,
          lists: 0,
          ship: pilot.ship,
          records: [],
          ranks: [],
          // Will be calculated at the end
          frequency: 0,
          winrate: 0,
          percentile: 0,
          deviation: 0,
        };
        data.pilot[faction][pilot.id] = {
          ...pilotInfo,
          lists: unique.has(pilot.id) ? pilotInfo.lists : pilotInfo.lists + 1,
          count: pilotInfo.count + 1,
          records: [...pilotInfo.records, squad.record],
          ranks: [
            ...pilotInfo.ranks,
            squad.rank.elimination ?? squad.rank.swiss,
          ],
        };

        // Pilot cost distribution
        const points = pilot.points as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
        data.pilotCostDistribution[points] += 1;

        // Pilot initiative distribution
        const skill = getPilotSkill(pilot.id);
        data.pilotSkillDistribution[skill] += 1;

        unique.add(pilot.id);

        // Ship stats
        const shipInfo = data.ship[faction][pilot.ship] || {
          frequency: 0,
          count: 0,
          lists: 0,
        };
        data.ship[faction][pilot.ship] = {
          ...shipInfo,
          count: shipInfo.count + 1,
          lists: unique.has(pilot.ship) ? shipInfo.lists : shipInfo.lists + 1,
        };

        unique.add(pilot.ship);

        // Upgrades stats
        (
          Object.entries(pilot.upgrades) as [XWSUpgradeSlots, string[]][]
        ).forEach(([slot, us]) => {
          us.forEach(u => {
            // Stats overall
            let upgradeInfo = data.upgrade['all'][u] || {
              slot,
              count: 0,
              lists: 0,
              records: [],
              ranks: [],
              // Will be calculated at the end
              frequency: 0,
              winrate: 0,
              percentile: 0,
              deviation: 0,
            };
            data.upgrade['all'][u] = {
              ...upgradeInfo,
              count: upgradeInfo.count + 1,
              lists: unique.has(u) ? upgradeInfo.lists : upgradeInfo.lists + 1,
              records: [...upgradeInfo.records, squad.record],
              ranks: [
                ...upgradeInfo.ranks,
                squad.rank.elimination ?? squad.rank.swiss,
              ],
            };

            // Stats per faction
            upgradeInfo = data.upgrade[faction][u] || {
              slot,
              count: 0,
              lists: 0,
              records: [],
              ranks: [],
              // Will be calculated at the end
              frequency: 0,
              winrate: 0,
              percentile: 0,
              deviation: 0,
            };
            data.upgrade[faction][u] = {
              ...upgradeInfo,
              count: upgradeInfo.count + 1,
              lists: unique.has(u) ? upgradeInfo.lists : upgradeInfo.lists + 1,
              records: [...upgradeInfo.records, squad.record],
              ranks: [
                ...upgradeInfo.ranks,
                squad.rank.elimination ?? squad.rank.swiss,
              ],
            };

            // Add upgrade to unique list so we now we added it to the "lists" field
            unique.add(u);
          });
        });
      });

      // Sort so we can generate an ID
      ships.sort();
      const shipCompositionId = ships.join('|');
      const shipCompositionCount =
        data.shipComposition.get(shipCompositionId) || 0;
      data.shipComposition.set(shipCompositionId, shipCompositionCount + 1);

      // Ship composition
      const cid = ships.join('.');
      const composition: CompositionDataCollection = data.composition[cid] || {
        ships: [...ships],
        faction,
        xws: [],
        record: { wins: 0, ties: 0, losses: 0 },
        ranks: [],
      };

      data.composition[cid] = {
        ...composition,
        xws: [...composition.xws, squad.xws],
        record: {
          wins: composition.record.wins + squad.record.wins,
          ties: composition.record.ties + squad.record.ties,
          losses: composition.record.losses + squad.record.losses,
        },
        ranks: [...composition.ranks, rank.elimination ?? rank.swiss],
      };
    }
  });

  return data;
};
