'use client';

import { XWSUpgrades } from '@/lib/types';
import { useSmallSamplesFilter } from '@/ui/params/small-samples-filter';

export interface PilotLoadoutProps {
  value: {
    id: string;
    list: XWSUpgrades;
    count: number;
    percentile: number;
  }[];
}

export const PilotLoadouts = ({ value }: PilotLoadoutProps) => {
  const [smallSamples] = useSmallSamplesFilter();
  let result = value;

  if (smallSamples === 'hide') {
    result = value.filter(({ count }) => count >= 5);
  }

  /**
   * same as with the squads: filter out low frequency loadouts
   * dont show loadout of SL?
   * sort by percentile / count / ... ?
   */

  return (
    <pre>
      <code>{JSON.stringify(result, null, 2)}</code>
    </pre>
  );
};
