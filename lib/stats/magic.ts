import { round } from '@/lib/utils/math.utils';

export interface MagicProps {
  percentile: number;
  deviation: number;
  count: number;
}

/**
 * Calculate a "magic number". This really is not clever or scientific.
 * Raw values, like percentile, will still reflect reality more. But
 * in order to give a "confidence score", this can be used.
 *
 * The whole idea behind this forumla is to reflect "the meta".
 */
export const magic = ({ percentile, deviation, count }: MagicProps) =>
  // round(Math.max(percentile - deviation, 0.001) * scale(coefficient) * 100, 2);
  round(
    Math.max(percentile - deviation, 0.001) *
      /**
       * Make sure that even a count of one still yields a score
       * that is not 0. ln(2) = 0.69, so use 0.3 for count = 1.
       */
      Math.max(Math.log(count), 0.3) *
      10,
    2
  );
