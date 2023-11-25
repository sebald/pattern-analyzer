import type { SquadEntitiyWithXWS } from '@/lib/db/types';
import type { GameRecord, XWSFaction } from '@/lib/types';
import { average, deviation, round, winrate } from '@/lib/utils/math.utils';

import { PerformanceHistory, createHistory, createPilotsId } from './utils';
import type { SquadStatData } from './types';

// Types
// ---------------
interface SquadPilotData {
  id: string;
  faction: XWSFaction;
  count: number;
  record: GameRecord;
  percentiles: number[];

  squads: SquadStatData[];
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
}

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
    // Get first squad to derive faction
    faction: squads[0].faction,
    count: 0,
    record: { wins: 0, ties: 0, losses: 0 },
    percentiles: [],
    squads: [],
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
  };

  return result;
};
