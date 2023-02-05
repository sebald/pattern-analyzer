import { combinations } from './utils';

export const createSubset = (squad: string[], omit: number) => {
  // No need to create a subset if no ship should be omitted.
  if (omit < 1) {
    return [squad];
  }

  // If squad is too small -> empty set
  if (squad.length <= omit) {
    return [];
  }

  //const range = [...Array(omit).keys()];
  //range.forEach(idx => {});

  // While last item of range is smaller than length of squad

  const subsets: string[][] = [];

  let i = 1; // Slicing at 0 doesn't make sense
  let current: string[];

  // TODO: find a way to remove
  while (i < squad.length) {
    current = squad.slice(i);
    console.log(current);
    subsets.push(...combinations(current));
    i = i + omit;
  }

  return subsets;
};
