import { round } from '@/lib/utils/math.utils';

/**
 * Linear scale, currently used when the coefficient is
 * a number of squads.
 */
const LINEAR = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9];

// Use a scale to absorb the coefficient a bit.
const scale = (val: number) => LINEAR[val] || 1;

export interface MagicProps {
  /**
   * **base** should be a value reflecting
   * the performance (e.g. percentile)
   */
  base: number;
  /**
   * **factor** should be a value reflecting
   * the quantity (e.g. frequency)
   */
  factor: number;
  /**
   * **coefficient** should be a value reflecting
   * the quality of the data (e.g. count)
   */
  coefficient: number;
}

/**
 * Calculate a "magic number". This really is not clever or scientific. Raw values,
 * like percentile, will still reflect reality more. In order to give a base
 * a "confidence score", this can be used.
 *
 * Basically:
 * - **base** should be a value reflecting the performance (e.g. percentile)
 * - **factor** should be a value reflecting the quantity (e.g. frequency)
 * - **coefficient** should be a value reflecting the quality of the data (e.g. count)
 *
 * Even though is calculate is absolute artificial, most people will feel the data and
 * its ranking is more correct and hopefully more relevant to them.
 */
export const magic = ({ base, factor, coefficient }: MagicProps) =>
  round(base * factor * scale(coefficient) * 100, 2);
