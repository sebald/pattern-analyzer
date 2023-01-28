import yasb from './data/yasb.json';
import { getPilotName } from './get-value';

// FIXME: This uses the pilot display name, we should rather use the id, but we don't jave ot
export const getPointsByName = (id: string) => {
  const name = getPilotName(id);

  const { points } = yasb.pilots.find(pilot => pilot.name === name) || {
    points: 1,
  };
  return points || 1;
};
