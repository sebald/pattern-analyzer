import { createSubsets } from './utils';

const SEPARATOR = '|';

export const analyze = (squads: string[][]) => {
  let subsets = new Set<string>();

  squads.forEach(squad => {
    const sets = createSubsets(squad).map(set => {
      set.sort();
      return set.join(SEPARATOR);
    });

    subsets = new Set([...subsets, ...sets]);
  });

  console.log([...subsets].length);

  return subsets;
};
