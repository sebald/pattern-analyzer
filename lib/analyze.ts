import { createSubsets } from './utils';

const SEPARATOR = '|';

export const isSubset = <T>(needle: T[], stack: T[]) =>
  needle.every(
    val =>
      stack.includes(val) &&
      needle.filter(el => el === val).length <=
        stack.filter(el => el === val).length
  );

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
