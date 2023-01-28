import type { XWSSquad } from './types';
import { getPointsByName } from './yasb';

const PILOT_ID_NORMALIZATION = {
  'maulermither-battleofyavin': 'maulermithel-battleofyavin',
  'dt798-tiefofighter': 'dt798',
};

export const normalizeXWS = (xws: XWSSquad | null) => {
  if (!xws) {
    return xws;
  }

  const pilots = xws.pilots.map(pilot => {
    //@ts-expect-error (ID accessing ...)
    // Fix some weird IDs from LBN
    const pilotId = PILOT_ID_NORMALIZATION[pilot.id];
    if (pilotId) {
      pilot = {
        ...pilot,
        id: pilotId,
      };
    }

    // Fix wrong pilots points from LBN
    if (pilot.points === 0) {
      pilot = {
        ...pilot,
        points: getPointsByName(pilot.id),
      };
    }

    return pilot;
  });

  return {
    ...xws,
    pilots,
  };
};
