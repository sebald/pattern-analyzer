'use client';

import { useTransition } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { pointsUpdateDate } from '@/lib/config';
import { Select, Spinner, type SelectProps } from '@/ui';
import {
  lastWeekend,
  monthsAgo,
  toDate,
  toRange,
} from '@/lib/utils/date.utils';

// Props
// ---------------
export interface DateSelectionProps extends Omit<SelectProps, 'children'> {}

// Component
// ---------------
export const DateSelection = (props: DateSelectionProps) => {
  const { replace } = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();
  const [lastThursday, lastSunday] = lastWeekend();

  const handleChange = (value: string) => {
    const [start, end] = value.split('/');
    const path = start
      ? `${pathname}?from=${start}${end ? `&to=${end}` : ''}`
      : pathname;

    startTransition(() => {
      replace(`${path}`);
    });
  };

  return (
    <div className="flex items-center gap-2">
      {pending ? <Spinner className="h-4 w-4" /> : null}
      <Select
        {...props}
        size="small"
        disabled={pending}
        onChange={e => handleChange(e.target.value)}
      >
        <Select.Option value={toRange(lastThursday, lastSunday)}>
          Last Weekend
        </Select.Option>
        <Select.Option value={toDate(monthsAgo(1))}>Last Month</Select.Option>
        <Select.Option value={toDate(monthsAgo(3))}>
          Last 3 Months
        </Select.Option>
        <Select.Option value={pointsUpdateDate}>
          Last Points Update
        </Select.Option>
      </Select>
    </div>
  );
};
