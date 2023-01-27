import { getEvent as getLongShankEvent } from './longshanks';

const VENDOR = {
  longshanks: getLongShankEvent,
};

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

  const get = VENDOR[vendor as keyof typeof VENDOR];

  const result = await get(id);
  return result;
};
