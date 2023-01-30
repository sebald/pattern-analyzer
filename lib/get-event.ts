import { getEvent as getLongShankEvent } from './longshanks';
import { getEvent as getRollbetterEvent } from './rollbetter';
import type { SquadData } from './types';

const VENDOR = {
  longshanks: getLongShankEvent,
  rollbetter: getRollbetterEvent,
};

export interface EvenData {
  urls: { href: string; text: string }[];
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
  // TODO: just call id ids in input?
  const events = id.split('%2B').map(getEvent);
  const data = await Promise.all(events);

  const result = data.reduce(
    (r, { url, title, squads }) => {
      r.urls.push({ href: url, text: `Event #${id}` });
      r.squads.push(...squads);
      return r;
    },
    {
      urls: [],
      title: 'test',
      squads: [],
    } as EvenData
  );

  return result;
};
