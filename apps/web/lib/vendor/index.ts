import * as listfortress from './listfortress';
import * as rollbetter from './rollbetter';
import type { Vendor, EventInfo, SquadData } from '../types';

interface VendorClient {
  getEventInfo(id: string): Promise<EventInfo>;
  getSquads(args: { id: string }): Promise<SquadData[]>;
}

const vendors: Record<Vendor, VendorClient> = { listfortress, rollbetter };

export const getVendor = (vendor: Vendor): VendorClient => vendors[vendor];
