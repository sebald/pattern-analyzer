'use client';

import { pointsUpdateDate } from '@/lib/config';
import {
  toDate,
  lastWeekend,
  monthsAgo,
  fromDate,
} from '@/lib/utils/date.utils';
import { fromDateRange } from '@/lib/utils/params.utils';
import { Select } from '@/ui/select';

import { useParams } from './useParams';

// Hooks
// ---------------
export const useDateRangeFilter = () => {
  const [filter, setFilter] = useParams(['from', 'to']);

  const setDateRange = (val: string) => {
    setFilter(fromDateRange(val));
  };

  const dateRange = filter.from
    ? filter.to
      ? `${filter.from}/${filter.to}`
      : filter.from
    : pointsUpdateDate;

  return [dateRange, setDateRange] as const;
};

// Component
// ---------------
export const DateRangeFilter = () => {
  const [dateRange, setDateRange] = useDateRangeFilter();

  let options = {
    'Last Points Update': '',
    'Last Weekend': toDate.apply(null, lastWeekend()),
    'Last Month': toDate(monthsAgo(1)),
    // Add the option if the last points update is older
    ...(fromDate(pointsUpdateDate) < monthsAgo(3)
      ? { 'Last 3 Months': toDate(monthsAgo(3)) }
      : {}),
  };
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
