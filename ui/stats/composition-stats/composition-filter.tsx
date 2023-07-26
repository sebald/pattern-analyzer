'use client';

import { FactionSelection, Select } from '@/ui';
import { useCompositionFilter } from './context';

// Component
// ---------------
export const CompositionFilter = () => {
  const { faction, setFaction, sort, setSort } = useCompositionFilter();

  return (
    <>
      <FactionSelection value={faction} onChange={setFaction} allowAll />
      <Select
        size="small"
        value={sort}
        onChange={e => setSort(e.target.value as any)}
      >
        <Select.Option value="percentile">By Percentile</Select.Option>
        <Select.Option value="deviation">By Std. Deviation</Select.Option>
        <Select.Option value="winrate">By Winrate</Select.Option>
        <Select.Option value="frequency">By Frequency</Select.Option>
        <Select.Option value="count">By Count</Select.Option>
        <Select.Option value="score">By Score</Select.Option>
      </Select>
    </>
  );
};
