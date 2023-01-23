'use client';

/**
 * Pesudo-hardcode this component for now until it is easier to
 * add client side components in next.
 */

import * as Radix from '@radix-ui/react-tabs';
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
        className="flex items-center gap-3 rounded-xl border border-secondary-100 bg-white/50 py-2 px-2 text-sm font-medium"
        aria-label="Switch between content"
      >
        {tabs.map(({ id, label }) => (
          <Radix.Trigger
            className={[
              'flex-1 cursor-pointer rounded-lg px-5 py-2 text-secondary-400 hover:bg-primary-50 hover:text-primary-700 hover:shadow-sm md:flex-initial',
              'data-active:bg-primary-200 data-active:text-primary-900 data-active:shadow-sm',
            ].join(' ')}
            key={`${id}-tab`}
            value={id}
          >
            {label}
          </Radix.Trigger>
        ))}
      </Radix.List>
      <div className="pt-20">
        {tabs.map(({ id }, idx) => (
          <Radix.Content key={`${id}-content`} value={id}>
            {content[idx]}
          </Radix.Content>
        ))}
      </div>
    </Radix.Root>
  );
};
