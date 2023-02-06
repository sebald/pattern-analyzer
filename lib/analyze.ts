import { createSubsets, isSubset } from './utils';

const SEPARATOR = '|';

export interface AnalyzeOotions {
  threshold?: number;
}

export const analyze = (
  squads: string[][],
  { threshold = 2 }: AnalyzeOotions = {}
) => {
  let subsets = new Set<string>();

  squads.forEach(squad => {
    const sets = createSubsets(squad).map(set => {
      set.sort();
      return set.join(SEPARATOR);
    });

    subsets = new Set([...subsets, ...sets]);
  });

  /**
   * Store subset -> ids of squad it is included,
   * where id is the index in the squads array.
   */
  const map = new Map<string, number[]>();

  subsets.forEach(key => {
    const set = key.split(SEPARATOR);
    squads.forEach((squad, idx) => {
      if (isSubset(set, squad)) {
        const occurance = map.get(key) || [];
        occurance.push(idx);
        map.set(key, occurance);
      }
    });
  });

  map.forEach((value, key) => {
    if (value.length < threshold) {
      map.delete(key);
    }
  });

  /**
   * Next:
   *
   * threshold for # of lists
   * threshold for size of combination/subset
   *
   * calculate ocrruance (appearance in lists / total squads)
   */

  return map;
};
