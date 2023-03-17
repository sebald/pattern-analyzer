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
        className="grid auto-cols-fr grid-flow-col gap-2 text-sm font-medium lg:text-lg"
        aria-label="Switch between content"
      >
        {labels.map(({ id, content }) => (
          <Radix.Trigger
            className={[
              'flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary-100 px-6 py-2 text-primary-500 hover:bg-primary-200 hover:text-primary-800 lg:px-32',
              'data-active:bg-primary-300 data-active:text-primary-800',
            ].join(' ')}
            key={`${id}-tab`}
            value={id}
          >
            {content}
          </Radix.Trigger>
        ))}
      </Radix.List>
      <div className="pt-14">
        {labels.map(({ id }, idx) => (
          <Radix.Content key={`${id}-content`} value={id}>
            {content[idx]}
          </Radix.Content>
        ))}
      </div>
    </Radix.Root>
  );
};
