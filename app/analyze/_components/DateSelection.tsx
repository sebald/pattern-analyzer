'use client';

import { useTransition } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { pointsUpdateDate } from '@/lib/config';
import { Select, Spinner, type SelectProps } from '@/ui';
import {
  fromDate,
  lastWeekend,
  monthsAgo,
  toDate,
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

  const handleChange = (value: string) => {
    const [start, end] = value.split('/');
    const path = start
      ? `${pathname}?from=${start}${end ? `&to=${end}` : ''}`
      : pathname;

    startTransition(() => {
      replace(`${path}`);
    });
  };

  const options = {
    'Last Points Update': pointsUpdateDate,
    'Last Weekend': toDate.apply(null, lastWeekend()),
    'Last Month': toDate(monthsAgo(1)),
    // Add the option if the last points update is older
    ...(fromDate(pointsUpdateDate) < monthsAgo(3)
      ? { 'Last 3 Months': toDate(monthsAgo(3)) }
      : {}),
  };
  type Options = keyof typeof options;

  return (
    <div className="flex items-center gap-2">
      {pending ? <Spinner className="h-4 w-4" /> : null}
      <Select
        {...props}
        size="small"
        disabled={pending}
        onChange={e => handleChange(e.target.value)}
      >
        {Object.keys(options).map(label => (
          <Select.Option key={label} value={options[label as Options]}>
            {label}
          </Select.Option>
        ))}
      </Select>
    </div>
  );
};
