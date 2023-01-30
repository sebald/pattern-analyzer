import {
  getEvent as getLongShankEvent,
  getEventInfo as getLongShankEventInfo,
} from './longshanks';
import {
  getEvent as getRollbetterEvent,
  getEventInfo as getRollbetterEventInfo,
} from './rollbetter';

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

export const mergeData = (title: string, add: string) => {
  if (title && add) {
    return `${title} & ${add}`;
  }

  return title ? title : add;
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
  const data = await Promise.all(eventIds.map(getEvent));

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
    title = mergeData(title, set.title || '');
    date = mergeData(date, set.date || '');
  });

  return {
    id: ids,
    vendor,
    title,
    date,
  };
};
