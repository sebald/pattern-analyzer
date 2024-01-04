'use client';

import { getPilotName } from '@/lib/get-value';
import { toPercentage } from '@/lib/utils';
import { Card, Detail, Link, PilotImage } from '@/ui';
import { Archive, View } from '@/ui/icons';
import { useSmallSamplesFilter } from '@/ui/params/small-samples-filter';
import { pid } from 'process';

// Helper
// ---------------
const EmptyState = () => (
  <div className="grid h-full place-items-center">
    <div className="flex flex-col items-center gap-3 py-12">
      <Archive className="h-10 w-10 text-secondary-400" />
      <div className="text-sm text-secondary-400">
        No frequently played squadmates. Maybe include small smaples by
        deactivating the filter on the right.
      </div>
    </div>
  </div>
);

// Props
// ---------------
export interface PilotSquadmatesProps {
  value: {
    [pids: string]: {
      count: number;
      percentile: number;
      deviation: number;
    };
  };
  baseline: {
    percentile: number;
  };
}

// Component
// ---------------
export const PilotSquadmates = ({ value, baseline }: PilotSquadmatesProps) => {
  const [smallSamples] = useSmallSamplesFilter();
  let result = Object.entries(value).filter(([id, stat]) => {
    // Only showing subsets size one (a.k.a. one squadmate)
    if (id.split('.').length > 1) {
      return false;
    }

    if (smallSamples === 'hide') {
      return stat.count >= 5;
    }

    return true;
  });

  if (result.length === 0) {
    return <EmptyState />;
  }

  result.sort(([aid, a], [bid, b]) => {
    const result = b.percentile - a.percentile;
    return result !== 0 ? result : aid.localeCompare(bid);
  });

  return (
    <Card size="fit" inset="list">
      <Card.Body variant="enumeration">
        {result.map(([pid, current]) => (
          <div key={pid} className="flex gap-4 px-4 py-5">
            <div>
              <PilotImage
                className="hidden w-52 rounded-md md:block"
                pilot={pid}
                type="art"
                width={208}
                height={208}
              />
            </div>
            <div className="flex flex-1 flex-col gap-6">
              <div className="flex flex-col gap-4">
                <div className="text-2xl font-bold leading-none">
                  {getPilotName(pid)}
                </div>
                <div className="flex flex-wrap gap-x-8 gap-y-4">
                  <Detail
                    label="Percentile"
                    value={toPercentage(current.percentile)}
                  />
                  <Detail
                    label="Std. Deviation"
                    value={
                      current.deviation ? toPercentage(current.deviation) : '-'
                    }
                  />
                  <Detail
                    label="Percentile when in Squad"
                    value={toPercentage(
                      current.percentile - baseline.percentile,
                      {
                        sign: true,
                      }
                    )}
                    highlight={current.percentile - baseline.percentile}
                  />
                </div>
              </div>
            </div>
            <div>
              <Link variant="button" size="small" href={`/pilot/${pid}`}>
                <View className="inline-block h-4 w-4" /> View Pilot
              </Link>
            </div>
          </div>
        ))}
      </Card.Body>
    </Card>
  );
};
