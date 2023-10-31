'use client';

import type { ChangeEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { pointsUpdateDate } from '@/lib/config';
import {
  toDate,
  lastWeekend,
  monthsAgo,
  fromDate,
} from '@/lib/utils/date.utils';
import { toDateRange } from '@/lib/utils/url.utils';

import { Select } from '@/ui/select';
import type { SelectProps } from '@/ui/select';
import { useSearchParam } from 'react-use';

export interface DateRangeFilterProps extends Omit<SelectProps, 'children'> {
  /**
   * Pathname of the base URL (range will be appended)
   */
  pathname: string;
}

export const DateRangeFilter = ({
  pathname,
  ...props
}: DateRangeFilterProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

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

  const updateDateRange = (e: ChangeEvent<HTMLSelectElement>) => {
    const [from, to] = e.target.value.split('/');
    const qs = searchParams.size ? `?${searchParams.toString()}` : '';

    router.push(`${pathname}/${toDateRange(from, to)}${qs}`);
  };

  return (
    <Select {...props} size="small" onChange={updateDateRange}>
      {Object.keys(options).map(label => (
        <Select.Option key={label} value={options[label as Options]}>
          {label}
        </Select.Option>
      ))}
    </Select>
  );
};
