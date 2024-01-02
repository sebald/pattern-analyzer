import type { SquadEntitiyWithXWS } from '@/lib/db/types';
import type { GameRecord, XWSFaction, XWSUpgrades } from '@/lib/types';
import {
  average,
  createSubsets,
  deviation,
  round,
  winrate,
} from '@/lib/utils/math.utils';

import {
  type DetailedSquadData,
  type GroupedDetailedSquadData,
  type PerformanceHistory,
  createHistory,
  createPilotsId,
  groupSquads,
  groupUpgrades,
} from './utils';
import { getPilots } from '@/lib/xws';

// Types
// ---------------
interface SquadPilotData {
  id: string;
  faction: XWSFaction;
  count: number;
  record: GameRecord;
  percentiles: number[];

  loadout: {
    upgrades: XWSUpgrades[];
    percentiles: number[];
  };
  squads: DetailedSquadData[];
  squadmates: {
    [pids: string]: {
      count: number;
      percentiles: number[];
    };
  };
}

export interface PilotStats {
  id: string;
  faction: XWSFaction;
  count: number;
  frequency: number;
  winrate: number | null;
  percentile: number;
  deviation: number;

  history: PerformanceHistory[];
  squads: GroupedDetailedSquadData;
  upgrades: {
    id: string;
    list: XWSUpgrades;
    count: number;
    percentile: number;
    deviation: number;
  }[];
  squadmates: {
    [pids: string]: {
      count: number;
      percentile: number;
      deviation: number;
    };
  };
}

// Helpers
// ---------------
const squadmatesStats = (squadmates: SquadPilotData['squadmates']) => {
  const entries = Object.entries(squadmates).map(
    ([smid, { count, percentiles }]) => {
      return [
        smid,
        {
          count,
          percentile: average(percentiles, 4),
          deviation: deviation(percentiles, 4),
        },
      ];
    }
  ) as [string, { count: number; percentile: number; deviation: number }][];

  return Object.fromEntries(
    entries.toSorted(([, a], [, b]) => b.percentile - a.percentile)
  );
};

// Module
// ---------------
export interface PilotDetailProps {
  pilot: string;
  squads: SquadEntitiyWithXWS[];
  count: { [Faction in XWSFaction]: number };
}

export const pilotDetails = ({ pilot, squads, count }: PilotDetailProps) => {
  const stats: SquadPilotData = {
    id: pilot,
    // Get first squad to derive faction (failsafe for extended...)
    faction: squads.length ? squads[0].faction : 'rebelalliance',
    count: 0,
    record: { wins: 0, ties: 0, losses: 0 },
    percentiles: [],
    loadout: {
      upgrades: [],
      percentiles: [],
    },
    squads: [],
    squadmates: {},
  };

  squads.forEach(current => {
    if (!current.xws) {
      console.log(current);
      return;
    }

    // Overall stats
    stats.count += 1;
    stats.record.wins += current.record.wins;
    stats.record.ties += current.record.ties;
    stats.record.losses += current.record.losses;
    stats.percentiles.push(current.percentile);

    current.xws.pilots.forEach(({ id, upgrades }) => {
      // Filter out other pilots
      if (id !== pilot) {
        return;
      }
      // Upgrades and percentiles need to be aligned for later
      stats.loadout.upgrades.push(upgrades);
      stats.loadout.percentiles.push(current.percentile);
    });

    stats.squads.push({
      id: createPilotsId(current.xws),
      tournamentId: current.tournamentId,
      player: current.player,
      xws: current.xws,
      date: current.date,
      record: current.record,
      rank: current.rank,
      percentile: current.percentile,
    });

    // const squadmates = getPilots(current.xws).filter(p => p !== pilot);
    // createSubsets(squadmates).forEach(subset => {
    //   // Remove empty set
    //   if (!subset.length) {
    //     return;
    //   }

    //   const id = subset.sort().join('.');

    //   if (!stats.squadmates[id]) {
    //     stats.squadmates[id] = {
    //       count: 0,
    //       percentiles: [],
    //     };
    //   }

    //   stats.squadmates[id].count += 1;
    //   stats.squadmates[id].percentiles.push(current.percentile);
    // });
  });

  const result: PilotStats = {
    id: stats.id,
    faction: stats.faction,
    count: stats.count,
    frequency: round(stats.count / count[stats.faction], 4),
    winrate: winrate([stats.record]),
    percentile: average(stats.percentiles, 4),
    deviation: deviation(stats.percentiles, 4),
    history: createHistory(stats.squads),
    squads: groupSquads(stats.squads),
    upgrades: groupUpgrades(stats.loadout),
    // squadmates: squadmatesStats(stats.squadmates),
    squadmates: {},
  };

  return result;
};
