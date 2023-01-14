import factions from './factions.json';
import upgrades from './upgrades.json';
import type { XWSFaction } from 'lib/xws';
import type { Ship, Upgrade } from './types';

export type Factions = keyof typeof factions;

export const getAllFactions = () =>
  (Object.keys(factions) as Factions[]).map(id => ({
    id,
    name: factions[id].name,
  }));

export const getFaction = ({ faction }: { faction: XWSFaction }) =>
  factions[faction];

export const getShip = ({
  faction,
  ship,
}: {
  faction: XWSFaction;
  ship: string;
}): Ship | undefined =>
  // @ts-ignore (TS doesn't like index signatures)
  getFaction({ faction }).ships[ship];

export const getPilot = ({
  faction,
  ship,
  pilot,
}: {
  faction: XWSFaction;
  ship: string;
  pilot: string;
}) => getShip({ faction, ship })?.pilots[pilot];

export const getUpgrade = ({
  type,
  name,
}: {
  type: string;
  name: string;
}): Upgrade | undefined =>
  // @ts-ignore (TS doesn't like index signatures)
  upgrades[type]?.[name];
