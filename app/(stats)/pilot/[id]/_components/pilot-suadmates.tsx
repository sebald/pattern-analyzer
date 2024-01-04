'use client';

import { Archive } from '@/ui/icons';
import { useSmallSamplesFilter } from '@/ui/params/small-samples-filter';

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
  let result = Object.entries(value);

  if (smallSamples === 'hide') {
    result = result.filter(([, stat]) => stat.count >= 5);
  }

  if (result.length === 0) {
    return <EmptyState />;
  }

  return result.map(([id, current]) => <div key={id}>hello</div>);
};
