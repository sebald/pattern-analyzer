'use client';

import { useTransition } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { POINTS_UPDATE_DATE } from '@/lib/env';
import { Select, Spinner, type SelectProps } from '@/ui';
import { monthsAgo, toDate } from '@/lib/utils/date.utils';

// Props
// ---------------
export interface DateSelectionProps extends Omit<SelectProps, 'children'> {}

// Component
// ---------------
export const DateSelection = (props: DateSelectionProps) => {
  const { replace } = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();

  const handleChange = (date: string) => {
    const path = date ? `${pathname}?from=${date}` : pathname;

    startTransition(() => {
      replace(`${path}`);
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Spinner className="h-4 w-4" />
      <Select
        {...props}
        size="small"
        disabled={pending}
        onChange={e => handleChange(e.target.value)}
      >
        <Select.Option value="">Last Month</Select.Option>
        <Select.Option value={toDate(monthsAgo(3))}>
          Last 3 Months
        </Select.Option>
        <Select.Option value={POINTS_UPDATE_DATE}>
          Last Points Update
        </Select.Option>
      </Select>
    </div>
  );
};
