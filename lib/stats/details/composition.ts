import type { Ships } from '@/lib/get-value';
import type { GameRecord, SquadData, XWSFaction, XWSSquad } from '@/lib/types';

// Types
// ---------------
export interface SquadCompositionData {
  id: string;
  faction: XWSFaction;
  squads: SquadData[];
  count: number;
  record: GameRecord;
  percentiles: number[];
}

export interface SquadCompositionStats {
  id: string;
  faction: XWSFaction;
  ships: Ships[];
  squads: SquadData[];
  count: number;
  frequency: number;
  winrate: number | null;
  percentile: number;
  deviation: number;
  score: number;
}

// Helpers
// ---------------
const isComposition = (id: string, xws: XWSSquad) => {
  const ships = xws.pilots.map(p => p.ship);
  ships.sort();
  return id === ships.join('.');
};

// Module
// ---------------
export const compositionDetails = (id: string, list: SquadData[][]) => {
  const stats: SquadCompositionData = {
    id,
    faction: 'rebelalliance', // just so TS shuts up
    squads: [],
    count: 0,
    record: { wins: 0, ties: 0, losses: 0 },
    percentiles: [],
  };

  list.forEach(data => {
    data.forEach(current => {
      if (!current.xws) return;
      if (!isComposition(id, current.xws)) return;

      stats.faction = current.xws.faction;
      stats.squads.push(current);

      // Gather data about exact pilot composition
      // count/lists/percentile/deviation

      // Gather data about each pilot and upgrade
      // count/lists/percentile/deviation
    });
  });

  const result: SquadCompositionStats = {
    id: stats.id,
    faction: stats.faction,
    ships: stats.id.split('.') as Ships[],
    squads: stats.squads,
    count: stats.count,
    frequency: 0,
    winrate: 0,
    percentile: 0,
    deviation: 0,
    score: 0,
  };

  return result;
};
