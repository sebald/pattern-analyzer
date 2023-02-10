import { createSubsets, isSubset, round } from './utils';

const SEPARATOR = '|';

export interface AnalyzeOotions {
  threshold?: number;
}

export interface AnalyzeResult {
  refs: number[];
  set: string[];
  occurrence: number;
  score: number;
}

export const analyze = (
  squads: string[][],
  { threshold = 2 }: AnalyzeOotions = {}
) => {
  const total = squads.length;
  let shipCount = 0; // used to calculate weighted average

  let subsets = new Set<string>();

  squads.forEach(squad => {
    shipCount = shipCount + squad.length;

    const sets = createSubsets(squad).map(set => {
      set.sort();
      return set.join(SEPARATOR);
    });

    subsets = new Set([...subsets, ...sets]);
  });

  // Calculate weighted averge
  const shipAverage = round(shipCount / total, 2);

  /**
   * Store subset -> ids of squad it is included,
   * where id is the index in the squads array.
   */
  const map = new Map<string, number[]>();

  subsets.forEach(key => {
    const set = key.split(SEPARATOR);
    squads.forEach((squad, idx) => {
      if (isSubset(set, squad)) {
        const entry = map.get(key) || [];
        entry.push(idx);
        map.set(key, entry);
      }
    });
  });

  let result: AnalyzeResult[] = [];

  map.forEach((entry, key) => {
    // Skip and remove if below threshold
    if (entry.length < threshold) {
      map.delete(key);
      return;
    }

    const set = key.split(SEPARATOR);
    if (set.length < 2) {
      return;
    }

    const occurrence = round(entry.length / total, 2);
    const score = round((set.length / shipAverage) * occurrence * 100, 2);

    result.push({
      refs: entry,
      set,
      occurrence,
      score,
    });
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

  // TODO: MAKE THRESHOLD FOR SET SIZE CONFIGURABLE

  return result;
};
