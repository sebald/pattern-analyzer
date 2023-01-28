import type { XWSSquad } from './types';

const PILOT_ID_NORMALIZATION = {
  'maulermither-battleofyavin': 'maulermithel-battleofyavin',
  'dt798-tiefofighter': 'dt798',
};

export const normalizeXWS = (xws: XWSSquad | null) => {
  if (!xws) {
    return xws;
  }

  // Fix some weird IDs from LBN
  const pilots = xws.pilots.map(pilot => {
    //@ts-expect-error (ID accessing ...)
    const pilotId = PILOT_ID_NORMALIZATION[pilot.id];
    if (pilotId) {
      return {
        ...pilot,
        id: pilotId,
      };
    }

    return pilot;
  });

  return {
    ...xws,
    pilots,
  };
};
