import {
  getEvent as getLongShankEvent,
  getEventInfo as getLongShankEventInfo,
} from './longshanks';
import {
  getEvent as getRollbetterEvent,
  getEventInfo as getRollbetterEventInfo,
} from './rollbetter';
import { EventData } from './types';
import { shortenTitles } from './utils';

const VENDOR = {
  longshanks: {
    getEvent: getLongShankEvent,
    getEventInfo: getLongShankEventInfo,
  },
  rollbetter: {
    getEvent: getRollbetterEvent,
    getEventInfo: getRollbetterEventInfo,
  },
};

export interface GetByVendorProps {
  vendor: keyof typeof VENDOR;
  ids: string;
}

/**
 * Get event data for one or mulitple events.
 */
export const getEventDataByVendor = async ({
  vendor,
  ids,
}: GetByVendorProps) => {
  if (!(vendor in VENDOR)) {
    throw new Error(`Unsupported vendor "${vendor}..."`);
  }

  const { getEvent } = VENDOR[vendor as keyof typeof VENDOR];
  const eventIds = ids.split('%2B'); // separated by "+"
  const events = await Promise.all(eventIds.map(getEvent));

  // Merge events into one
  const data = events.reduce<EventData>(
    (o, { title, id, url, squads }) => {
      o.title = shortenTitles(o.title, title || '');
      o.urls.push({ href: url, text: `Event #${id}` });
      o.squads.push(...squads);

      return o;
    },
    {
      title: '',
      urls: [],
      squads: [],
    }
  );

  return data;
};

export const getEventInfoByVendor = async ({
  vendor,
  ids,
}: GetByVendorProps) => {
  if (!(vendor in VENDOR)) {
    throw new Error(`Unsupported vendor "${vendor}..."`);
  }

  const { getEventInfo } = VENDOR[vendor as keyof typeof VENDOR];
  const eventIds = ids.split('+'); // separated by "+"
  const data = await Promise.all(eventIds.map(getEventInfo));

  // Merge info
  let title = '';
  let date = '';

  data.forEach(set => {
    title = shortenTitles(title, set.title || '');
    date = [date, set.date || ''].filter(Boolean).join(' & ');
  });

  return {
    id: ids,
    vendor,
    title,
    date,
  };
};
