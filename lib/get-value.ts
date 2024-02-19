import data from './data/display-values.json';
import standard from './data/standard-ships.json';
import { XWSFaction } from './types';

export type Factions = keyof typeof data.faction;
export type Ships = keyof typeof data.ship;

export const getAllFactions = () =>
  (Object.entries(data.faction) as [Factions, string][]).map(([id, name]) => ({
    id,
    name,
  }));

export const getFactionName = (faction: XWSFaction) => data.faction[faction];

export const getShipName = (xws: string): Ships | null =>
  (data.ship as any)[xws] || null;

export const getPilotName = (xws: string): string | null =>
  (data.pilot as any)[xws] || null;

export const getUpgradeName = (xws: string): string | null =>
  (data.upgrades as any)[xws] || null;

export const getStandardShips = (faction: Factions) =>
  standard[faction].ships as Ships[];

export const getFactionByShip = (ship: Ships) => {
  let faction: XWSFaction = 'rebelalliance'; // Init with something

  for (const key in standard) {
    const current = key as XWSFaction;
    const hasShip = standard[current].ships.includes(ship);

    if (hasShip) {
      faction = current;
      break;
    }
  }

  return faction;
};
