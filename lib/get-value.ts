import data from './data/display-values.json';
import legal from './data/standard-legal.json';
import { XWSFaction } from './types';

export type Factions = keyof typeof data.faction;
export type Ships = keyof typeof data.ship;

export const getAllFactions = () =>
  (Object.entries(data.faction) as [Factions, { name: string }][]).map(
    ([id, { name }]) => ({ id, name })
  );

export const getFactionName = (faction: XWSFaction) =>
  data.faction[faction].name;

export const getFactionIcon = (faction: XWSFaction) =>
  data.faction[faction].icon;

export const getShipName = (xws: string): Ships | null =>
  (data.ship as any)[xws] || null;

export const getPilotName = (xws: string): string | null =>
  (data.pilot as any)[xws] || null;

export const getUpgradeName = (xws: string): string | null =>
  (data.upgrades as any)[xws] || null;

export const getStandardShips = (faction: Factions) =>
  legal[faction].ships as Ships[];
