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
        className="flex items-center gap-2 text-sm font-medium"
        aria-label="Switch content"
      >
        {tabs.map(({ id, label }) => (
          <Radix.Trigger
            className={[
              // montserrat.className,
              'flex-1 cursor-pointer items-center gap-2 rounded-lg bg-primary-100 px-5 py-2 text-primary-500 hover:text-primary-700 md:flex-initial',
              'data-active:bg-primary-200 data-active:text-primary-700 data-active:hover:bg-primary-100',
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
