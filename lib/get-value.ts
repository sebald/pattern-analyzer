import data from './data/display-values.json';
import { XWSFaction } from './types';

export type Factions = keyof typeof data.faction;

export const getAllFactions = () =>
  (Object.entries(data.faction) as [Factions, { name: string }][]).map(
    ([id, { name }]) => ({ id, name })
  );

export const getFactionName = (faction: XWSFaction) =>
  data.faction[faction].name;

export const getFactionIcon = (faction: XWSFaction) =>
  data.faction[faction].icon;

export const getShipName = (xws: string): string | null =>
  (data.ship as any)[xws] || null;

export const getPilotName = (xws: string): string | null =>
  (data.pilot as any)[xws] || null;

export const getUpgradeName = (xws: string): string | null =>
  (data.upgrades as any)[xws] || null;
