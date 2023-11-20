import type { XWSSquad } from '@/lib/types';

/**
 * Create a composition id from XWS (pilot ids separated by a ".")
 */
export const createPilotsId = (xws: XWSSquad) => {
  const pilots = [...xws.pilots];
  pilots.sort((a, b) => {
    if (a.ship < b.ship) {
      return -1;
    }
    if (a.ship > b.ship) {
      return 1;
    }
    if (a.id < b.id) {
      return -1;
    }
    if (a.id > b.id) {
      return 1;
    }
    return 0;
  });

  return pilots.map(({ id }) => id).join('.');
};
