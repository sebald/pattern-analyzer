import { Card } from 'components';

export interface MetaProps {
  value: string[][];
}

/**
 * Converts a 2D array into a list of tuples, where
 * - the first value is the pilot ID and
 * - the second value is the list of squads the pilots belongs to,
 *   represented by a number, initially it set to 1.
 */
const toTuples = (value: string[][]) =>
  value
    .map((squad, i) => squad.map(pilot => [pilot, [i]] as [string, number[]]))
    .flat();

/**
 * Create an array with every possible combinations
 */
const toCombinations = (array: string[]) =>
  array.flatMap((v, i) => array.slice(i + 1).map(w => [v, w]));

const isSubset = (parent: string[], subset: string[]) =>
  subset.every(el => parent.includes(el));

const mapReduce = (tuples: [string, number[]][], squads: string[][]) => {
  const m = new Map<string, number[]>();

  // Map
  tuples.forEach(([pilot, ref]) => {
    const entry = m.get(pilot) || [];
    entry.push(...ref);

    m.set(pilot, entry);
  });

  /**
   * Create the combination of all keys,
   * ignoring pilots that only appear once
   */
  const combination = toCombinations(
    Array.from(m.keys()).filter(pilot => (m.get(pilot)?.length || 0) > 1)
  );

  // NEXT: iterate over all squads and remove those who don't have
  //       one of the pilot combinations
  const result = squads.filter(pilots =>
    combination.some(c => isSubset(pilots, c))
  );

  // if the results did not get smaller we have to make the pilot set larger
  // e.g. we start with 2, now we take combinations of 3

  // No? Group squads that have the same subset of pilots
  return result;
};

export const Meta = ({ value }: MetaProps) => {
  const list = toTuples(value);
  console.log(mapReduce(list, value));
  return (
    <Card>
      <Card.Title>Meta</Card.Title>
    </Card>
  );
};
