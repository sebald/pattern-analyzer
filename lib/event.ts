import { Vendor } from './types';

import * as listfortress from './vendor/listfortress';
import * as longshanks from './vendor/longshanks';
import * as rollbetter from './vendor/rollbetter';

const VENDOR_MAP = {
  listfortress,
  longshanks,
  rollbetter,
} satisfies { [name in Vendor]: any };

// API
// ---------------
export interface EventProps {
  vendor: Vendor;
  id: string;
}

export const getEventInfo = async ({ vendor, id }: EventProps) => {
  if (!(vendor in VENDOR_MAP)) {
    throw new Error(`Unsupported vendor "${vendor}..."`);
  }

  const info = await VENDOR_MAP[vendor].getEventInfo(id);
  return info;
};

export interface GetSquadsDataProps {}

export const getSquadsData = async ({ vendor, id }: EventProps) => {
  if (!(vendor in VENDOR_MAP)) {
    throw new Error(`Unsupported vendor "${vendor}..."`);
  }

  const players = await VENDOR_MAP[vendor].getPlayerData(id);
  const squads = await VENDOR_MAP[vendor].getSquadsData(id, players);

  return squads;
};
