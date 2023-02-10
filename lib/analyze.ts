import { createSubsets, isSubset } from './utils';

const SEPARATOR = '|';

const calcWeightedAverage = (squads: string[][]) => {
  let total = squads.length;
  let mean = 0;

  squads.forEach(squad => {});

  const mapping = squads
    .map(squad => squad.length)
    // just add together the size?
    .reduce<{ [size: number]: number; total: number }>(
      (map, val) => {
        const count = map[val] ?? 0;
        map[val] = count + 1;
        total++;

        return map;
      },
      { total: 0 }
    );

  return (
    Object.entries(mapping).reduce((mean, [size, count]) => {
      mean = mean + Number(size) * count;
      return mean;
    }, 0) / total
  );
};

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
   * weight: large combination = better
   *
   * subset weight = subset size / average # of ships +/* occurance percentage
   */

  return map;
};
