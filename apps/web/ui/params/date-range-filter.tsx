'use client';

import { dateRangePresets, fromDateRange } from '@/lib/utils/params.utils';
import { Select } from '@/ui/select';

import { useParams } from './useParams';

// Hooks
// ---------------
export const useDateRangeFilter = () => {
  const [filter, setFilter] = useParams(['from', 'to']);

  const setDateRange = (val: string) => {
    setFilter(fromDateRange(val));
  };

  // No param means the default preset, which is resolved server side.
  const dateRange = filter.from
    ? filter.to
      ? `${filter.from}/${filter.to}`
      : filter.from
    : '';

  return [dateRange, setDateRange] as const;
};

// Component
// ---------------
export const DateRangeFilter = () => {
  const [dateRange, setDateRange] = useDateRangeFilter();

  const options = dateRangePresets();
  type Options = keyof typeof options;

  return (
    <Select
      size="small"
      value={dateRange}
      onChange={e => setDateRange(e.target.value)}
    >
      {Object.keys(options).map(label => (
        <Select.Option key={label} value={options[label as Options]}>
          {label}
        </Select.Option>
      ))}
    </Select>
  );
};
