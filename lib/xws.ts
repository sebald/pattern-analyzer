import type { XWSSquad } from './types';
import SL_PILOTS from './data/standard-loadout-pilots.json';

// LBN has some error and unnormalized in pilot ids.
const PILOT_ID_MAP = {
  'maulermither-battleofyavin': 'maulermithel-battleofyavin',
  'dt798-tiefofighter': 'dt798',
  'anakinskywalker-eta2actis-siegeofcoruscant':
    'anakinskywalker-siegeofcoruscant',
  'obiwankenobi-eta2actis-siegeofcoruscant': 'obiwankenobi-siegeofcoruscant',
};

/**
 * Adjust some irregularities coming from LBN.
 */
export const normalize = (xws: XWSSquad | null) => {
  if (!xws) {
    return xws;
  }

  const pilots = xws.pilots.map(pilot => {
    // Fix some weird IDs from LBN
    //@ts-expect-error (ID accessing allowed to fail)
    const pilotId = PILOT_ID_MAP[pilot.id];
    if (pilotId) {
      pilot = {
        ...pilot,
        id: pilotId,
      };
    }

    // Add loadout and costs to pilots with standard loadouts
    //@ts-expect-error (ID accessing allowed to fail)
    const props = SL_PILOTS[pilotId];
    if (props) {
      pilot = {
        ...pilot,
        ...props,
      };
    }

    return pilot;
  });

  return {
    ...xws,
    pilots,
  };
};
