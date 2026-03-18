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
    deviation: number;
  }[];
  baseline: {
    percentile: number;
  };
}

// Components
// ---------------
export const PilotLoadouts = ({ value, baseline }: PilotLoadoutProps) => {
  const [smallSamples] = useSmallSamplesFilter();
  let result = value;

  if (smallSamples === 'hide') {
    result = value.filter(({ count }) => count >= 5);
  }

  if (result.length === 0) {
    return <EmptyState />;
  }

  return result.map(current => (
    <List key={current.id}>
      <List.Item variant="complex">
        <div className="flex gap-8">
          <div className="w-10">
            <Badge variant="light">{current.count}</Badge>
          </div>
          <div className="flex flex-1 flex-col gap-x-4 gap-y-2 text-lg font-medium md:gap-x-8 md:gap-y-4">
            {current.id.split('.').map(getUpgradeName).join(', ')}
            <div className="flex gap-x-8">
              <Detail
                label="Percentile"
                value={toPercentage(current.percentile)}
              />
              <Detail
                label="Std. Deviation"
                value={toPercentage(current.deviation)}
              />
              <Detail
                label="vs. Pilot Average"
                value={toPercentage(current.percentile - baseline.percentile, {
                  sign: true,
                })}
                highlight={current.percentile - baseline.percentile}
              />
            </div>
          </div>
        </div>
      </List.Item>
    </List>
  ));
};
