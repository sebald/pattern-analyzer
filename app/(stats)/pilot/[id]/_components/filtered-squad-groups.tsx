'use client';

import { Archive } from '@/ui/icons';
import { useSmallSamplesFilter } from '@/ui/params/small-samples-filter';
import { SquadGroups, type SquadGroupsProps } from '@/ui/stats/squad-groups';

const EmptyState = () => (
  <div className="grid h-full place-items-center">
    <div className="flex flex-col items-center gap-3 py-12">
      <Archive className="h-10 w-10 text-secondary-400" />
      <div className="text-sm text-secondary-400">
        No frequently played squads. Maybe include small smaples by deactivating
        the filter on the right.
      </div>
    </div>
  </div>
);

export const FilteredSquadGroups = ({ value }: SquadGroupsProps) => {
  const [smallSamples] = useSmallSamplesFilter();
  let result = value;

  if (smallSamples === 'hide') {
    result = Object.fromEntries(
      Object.entries(value).filter(([, stat]) => stat.items.length >= 3)
    );
  }

  return Object.keys(result).length ? (
    <SquadGroups value={result} />
  ) : (
    <EmptyState />
  );
};
