'use client';

/**
 * Pesudo-hardcode this component for now until it is easier to
 * add client side components in next.
 */

import * as Radix from '@radix-ui/react-tabs';
import { montserrat } from 'app/fonts';
import React from 'react';

export interface TabsProps {
  labels: string[];
  children?: React.ReactNode;
}

export const Tabs = ({ labels, children }: TabsProps) => {
  const tabs = labels.map(label => ({
    id: label.toLocaleLowerCase().replace(/\s/g, '-'),
    label,
  }));
  const content = React.Children.toArray(children);

  return (
    <Radix.Root defaultValue={tabs[0].id}>
      <Radix.List
        className="-mb-px flex items-center gap-4 border-b border-b-secondary-100 text-sm font-medium"
        aria-label="Switch content"
      >
        {tabs.map(({ id, label }) => (
          <Radix.Trigger
            className={[
              montserrat.className,
              'relative inline-flex cursor-pointer items-center gap-2 px-5 py-3 text-lg font-medium text-secondary-300 hover:text-primary-500',
              'data-active:text-primary-700 data-active:after:absolute data-active:after:left-0 data-active:after:bottom-[-1px] data-active:after:h-0.5 data-active:after:w-full data-active:after:bg-primary-700',
            ].join(' ')}
            key={`${id}-tab`}
            value={id}
          >
            {label}
          </Radix.Trigger>
        ))}
      </Radix.List>
      <div className="pt-12">
        {tabs.map(({ id }, idx) => (
          <Radix.Content key={`${id}-content`} value={id}>
            {content[idx]}
          </Radix.Content>
        ))}
      </div>
    </Radix.Root>
  );
};
