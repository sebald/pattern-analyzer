'use client';

import { Switch } from '@/ui/switch';
import { useQueryFilter } from './useQueryFilter';

// Hook
// ---------------
export const useSmallSamplesFilter = () => {
  const [filter, setFilter] = useQueryFilter(['small-samples']);

  const setSmallSamples = (val: boolean) =>
    setFilter({
      ['small-samples']: val ? 'show' : null,
    });

  return [
    filter['small-samples'] === 'show' ? 'show' : 'hide',
    setSmallSamples,
  ] as const;
};

// Component
// ---------------
export const SmallSamplesFilter = () => {
  const [smallSamples, setSmallSamples] = useSmallSamplesFilter();

  return (
    <Switch
      size="small"
      label="Hide small Samples"
      defaultChecked={smallSamples === 'hide'}
      onCheckedChange={checked => setSmallSamples(!checked)}
    />
  );
};
