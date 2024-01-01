'use client';

import { getUpgradeName } from '@/lib/get-value';
import { XWSUpgrades } from '@/lib/types';
import { toPercentage } from '@/lib/utils/math.utils';
import { Badge, Detail, Headline, List } from '@/ui';
import { Archive } from '@/ui/icons';
import { useSmallSamplesFilter } from '@/ui/params/small-samples-filter';

// Helper
// ---------------
const EmptyState = () => (
  <div className="grid h-full place-items-center">
    <div className="flex flex-col items-center gap-3 py-12">
      <Archive className="h-10 w-10 text-secondary-400" />
      <div className="text-sm text-secondary-400">
        No frequently played loadouts. Maybe include small smaples by
        deactivating the filter on the right.
      </div>
    </div>
  </div>
);

// Props
// ---------------
export interface PilotLoadoutProps {
  value: {
    id: string;
    list: XWSUpgrades;
    count: number;
    percentile: number;
  }[];
}

// Components
// ---------------
export const PilotLoadouts = ({ value }: PilotLoadoutProps) => {
  const [smallSamples] = useSmallSamplesFilter();
  let result = value;

  if (smallSamples === 'hide') {
    result = value.filter(({ count }) => count >= 5);
  }

  if (result.length === 0) {
    return <EmptyState />;
  }

  /**
   * same as with the squads: filter out low frequency loadouts
   * dont show loadout of SL?
   * sort by percentile / count / ... ?
   *
   * Do we need "list" property!?
   */

  return result.map(current => (
    <List key={current.id}>
      <List.Item variant="complex">
        <div className="flex gap-4">
          <div className="w-14">
            <Badge variant="light">{current.count}</Badge>
          </div>
          <div className="flex-1 text-lg font-medium">
            {current.id.split('.').map(getUpgradeName).join(', ')}
          </div>
          <div className="flex flex-col gap-2">
            <Detail
              label="Percentile"
              value={toPercentage(current.percentile)}
              align="left"
              size="fit"
            />
            <Detail
              label="Std. Deviation"
              value={toPercentage(current.percentile)}
              align="left"
              size="fit"
            />
          </div>
        </div>
      </List.Item>
    </List>
  ));
};
