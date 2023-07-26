'use client';

import { type ReactNode, useTransition } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { DateSelection, Spinner, Switch } from '@/ui';

// Props
// ---------------
export interface FilterProps {
  children?: ReactNode;
  dateRange: string;
  smallSamples: boolean;
}

// Component
// ---------------
export const Filter = ({ children, dateRange, smallSamples }: FilterProps) => {
  const { replace } = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();

  type HandleChangeProps = ['dateRange', string] | ['smallSamples', boolean];
  const handleChange = ([name, value]: HandleChangeProps) => {
    const params = new URLSearchParams(window.location.search);

    // Date Range
    if (name === 'dateRange') {
      const [start, end] = value.split('/');
      params.set('from', start);

      if (end) {
        params.set('to', end);
      } else {
        params.delete('to');
      }
    }

    // Toggle Small Samples
    if (name === 'smallSamples') {
      params.set('small-samples', value ? 'hide' : 'show');
    }

    startTransition(() => {
      replace(`${pathname}?${params.toString()}`);
    });
  };

  return (
    <div className="flex flex-row flex-wrap items-center justify-end gap-2 pb-8 sm:gap-4">
      {pending ? <Spinner className="h-4 w-4" /> : null}
      <Switch
        size="small"
        label="Hide small Samples"
        defaultChecked={smallSamples}
        onCheckedChange={checked => handleChange(['smallSamples', checked])}
        disabled={pending}
      />
      <DateSelection
        defaultValue={dateRange}
        onChange={e => handleChange(['dateRange', e.target.value])}
        disabled={pending}
      />
      {children}
    </div>
  );
};
