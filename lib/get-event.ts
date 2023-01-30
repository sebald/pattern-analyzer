import { getEvent as getLongShankEvent } from './longshanks';
import { getEvent as getRollbetterEvent } from './rollbetter';
import type { SquadData } from './types';

const VENDOR = {
  longshanks: getLongShankEvent,
  rollbetter: getRollbetterEvent,
};

export interface EvenData {
  urls: { href: string; text: string }[];
  title: (string | null)[];
  squads: SquadData[];
}

export interface GetEventByVendorProps {
  vendor: string;
  ids: string;
}

/**
 * Get event data for one or mulitple events.
 */
export const getEventDataByVendor = async ({
  vendor,
  ids,
}: GetEventByVendorProps) => {
  if (!(vendor in VENDOR)) {
    throw new Error(`Unsupported vendor "${vendor}..."`);
  }

  const getEvent = VENDOR[vendor as keyof typeof VENDOR];
  const eventIds = ids.split('%2B'); // separated by "+"
  const data = await Promise.all(eventIds.map(getEvent));

  const result = data.reduce(
    (r, { url, title, squads }) => {
      r.urls.push({ href: url, text: `Event #${ids}` });
      r.squads.push(...squads);
      r.title.push(title);

      return r;
    },
    {
      urls: [],
      title: [],
      squads: [],
    } as EvenData
  );

  return result;
};
