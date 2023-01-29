import { getEvent as getLongShankEvent } from './longshanks';
import { getEvent as getRollbetterEvent } from './rollbetter';
import type { SquadData } from './types';

const VENDOR = {
  longshanks: getLongShankEvent,
  rollbetter: getRollbetterEvent,
};

export interface EvenData {
  urls: string[];
  title: string;
  squads: SquadData[];
}

export interface GetEventByVendorProps {
  vendor: string;
  id: string;
}

export const getEventByVendor = async ({
  vendor,
  id,
}: GetEventByVendorProps) => {
  if (!(vendor in VENDOR)) {
    throw new Error(`Unsupported vendor "${vendor}..."`);
  }

  const getEvent = VENDOR[vendor as keyof typeof VENDOR];

  // Allow to fetch multiple Ids and merge
  const events = id.split('%2B').map(getEvent);
  const data = await Promise.all(events);

  const result = data.reduce(
    (r, { url, title, squads }) => {
      r.url.push(url);
      r.squads.push(...squads);
      return r;
    },
    {
      url: [],
      title: 'test',
      squads: [],
    } as EvenData
  );
  console.log(result.url);
  return result;
};
