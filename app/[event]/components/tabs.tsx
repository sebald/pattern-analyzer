'use client';

/**
 * Pesudo-hardcode this component for now until it is easier to
 * add client side components in next.
 */

import * as Radix from '@radix-ui/react-tabs';
import React from 'react';

export interface TabsProps {
  labels: { content: React.ReactNode; id: string }[];
  defaultTab?: string;
  children?: React.ReactNode;
}

export const Tabs = ({ labels, defaultTab, children }: TabsProps) => {
  const content = React.Children.toArray(children);

  return (
    <Radix.Root defaultValue={defaultTab}>
      <Radix.List
        className="flex items-center gap-2 text-sm font-medium"
        aria-label="Switch between content"
      >
        {labels.map(({ id, content }) => (
          <Radix.Trigger
            className={[
              'flex flex-1 cursor-pointer items-center gap-1 rounded-lg bg-primary-100 px-24 py-2 text-primary-500 hover:bg-primary-200 hover:text-primary-800 lg:flex-initial',
              'data-active:bg-primary-300 data-active:text-primary-800',
            ].join(' ')}
            key={`${id}-tab`}
            value={id}
          >
            {content}
          </Radix.Trigger>
        ))}
      </Radix.List>
      <div className="pt-20">
        {labels.map(({ id }, idx) => (
          <Radix.Content key={`${id}-content`} value={id}>
            {content[idx]}
          </Radix.Content>
        ))}
      </div>
    </Radix.Root>
  );
};
