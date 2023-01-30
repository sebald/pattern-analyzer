import yasb from './data/yasb.json';
import { getPilotName } from './get-value';

/**
 * Take a display text (e.g. "Han Solo") and convert it to an
 * XWS identifier.
 *
 * Note that xwing-data2 and YASB differ here when it comes to
 * secondary info like ships and scenario packs. YASB includes this
 * information in the display title (e.g. "Han Solo (BoY)" or "Han Solo (Scum)").
 *
 * On the other hand YASB does not append this information to the xws all
 * the time. We nee transform this ourselves.
 */
export const toXWSIdentifier = (input: string) => {
  // `suffix` can be a scenario, ship or faction
  const [name, suffix = ''] = input.split(/[()]/);

  const id = name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .replace(/\s+/g, '-');

  // @ts-expect-error (using indexsignature here is fine TS ...)
  return `${id}${SUFFIX_NORMALIZATION[suffix] || ''}`;
};

export const getPointsByName = (id: string) => {
  // Normalize names that contain weird quotes and use regular instead
  const name = getPilotName(id)?.replace(/[“”]/g, '"');

  const { points } = yasb.pilots.find(
    pilot => pilot.xws === id || pilot.name === name
  ) || {
    points: 1,
  };
  return points || 1;
};
