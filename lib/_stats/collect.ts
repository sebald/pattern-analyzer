import { Ships } from '../get-value';
import { SquadData, XWSUpgradeSlots } from '../types';
import { getPilotSkill } from '../yasb';
import { init } from './init';

export const collect = (squads: SquadData[]) => {
  const stats = init();

  squads.forEach(squad => {
    // Number of Squads with XWS
    if (squad.xws) {
      stats.tournamentStats.xws += 1;
    }

    const faction = squad.xws ? squad.xws.faction : 'unknown';

    // Faction Stats
    const rank = squad.rank;
    stats.factionStats[faction].count += 1;
    stats.factionStats[faction].ranks.push(rank.elimination ?? rank.swiss);
    stats.factionStats[faction].records.push(squad.record);
    if (rank.elimination) {
      stats.tournamentStats.cut += 1;
    }

    // Squad Size
    if (squad.xws) {
      const numPilots = squad.xws.pilots.length as 3 | 4 | 5 | 6 | 7 | 8;
      stats.squadSizes[numPilots] = stats.squadSizes[numPilots] + 1;
    }

    if (squad.xws && faction !== 'unknown') {
      // Use to store ships of the squad
      const ships: Ships[] = [];
      // Use to filter duplicated pilots (a.k.a. generics) and upgrades
      const unique = new Set<string>();

      squad.xws.pilots.forEach(pilot => {
        // Add ship
        ships.push(pilot.ship);

        // Pilot stats
        const pilotInfo = stats.pilotStats[faction][pilot.id] || {
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
        pilotStats[faction][pilot.id] = {
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
        pilotCostDistribution[points] = pilotCostDistribution[points] + 1;

        // Pilot initiative distribution
        const skill = getPilotSkill(pilot.id);
        pilotSkillDistribution[skill] = pilotSkillDistribution[skill] + 1;

        unique.add(pilot.id);

        // Ship stats
        const shipInfo = shipStats[faction][pilot.ship] || {
          frequency: 0,
          count: 0,
          lists: 0,
        };
        shipStats[faction][pilot.ship] = {
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
            let upgradeInfo = upgradeStats['all'][u] || {
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
            upgradeStats['all'][u] = {
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
            upgradeInfo = upgradeStats[faction][u] || {
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
            upgradeStats[faction][u] = {
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
      const shipCompositionCount = shipComposition.get(shipCompositionId) || 0;
      shipComposition.set(shipCompositionId, shipCompositionCount + 1);
    }
  });
};
