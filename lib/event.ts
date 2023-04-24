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
export interface GetEventInfoProps {
  vendor: Vendor;
  id: string;
}

export const getEventInfo = async ({ vendor, id }: GetEventInfoProps) => {
  if (!(vendor in VENDOR_MAP)) {
    throw new Error(`Unsupported vendor "${vendor}..."`);
  }

  const info = await VENDOR_MAP[vendor].getEventInfo(id);
  return info;
};
