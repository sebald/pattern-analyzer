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
    (o, { title, id, url, squads, rounds }) => {
      o.id.push(id);
      o.title = shortenTitles(o.title, title || '');
      o.urls.push({ href: url, text: `Event #${id}` });
      o.squads.push(...squads);

      /**
       * Rounds can not be merged, makes only sense if
       * is a single event.
       */
      if (eventIds.length === 1) {
        o.rounds.push(...rounds);
      }

      return o;
    },
    {
      id: [],
      title: '',
      vendor,
      urls: [],
      squads: [],
      rounds: [],
    }
  );

  data.squads.sort((a, b) => {
    if (a.rank.elimination && b.rank.elimination) {
      return a.rank.elimination - b.rank.elimination;
    }

    if (a.rank.elimination && !b.rank.elimination) {
      return -1;
    }

    if (!a.rank.elimination && b.rank.elimination) {
      return 1;
    }

    return a.rank.swiss - b.rank.swiss;
  });

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
