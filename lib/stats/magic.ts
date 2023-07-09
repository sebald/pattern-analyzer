import { round } from '@/lib/utils/math.utils';

/**
 * Linear scale, currently used when the coefficient is
 * a number of squads.
 */
const LINEAR = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9];

// Use a scale to absorb the coefficient a bit.
const scale = (val: number) => LINEAR[val] || 1;

export interface MagicProps {
  percentile: number;
  deviation: number;
  /**
   * **coefficient** should be a value reflecting
   * the quality of the data (e.g. count)
   */
  coefficient: number;
}

/**
 * Calculate a "magic number". This really is not clever or scientific. Raw values,
 * like percentile, will still reflect reality more. In order to give
 * a "confidence score", this can be used.
 *
 * The whole idea behind this forumla is to reflect "the meta".
 */
export const magic = ({ percentile, deviation, coefficient }: MagicProps) =>
  round(Math.max(percentile - deviation, 0.001) * scale(coefficient) * 100, 2);
