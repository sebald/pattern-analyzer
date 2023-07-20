'use client';

import * as React from 'react';
import * as Primitive from '@radix-ui/react-accordion';

import { cn } from '@/lib/utils';
import { ChevronDown } from './icons';

// Accordion.Item
// ---------------
const AccordionItem = React.forwardRef<
  React.ElementRef<typeof Primitive.Item>,
  React.ComponentPropsWithoutRef<typeof Primitive.Item>
>(({ className, ...props }, ref) => (
  <Primitive.Item
    ref={ref}
    className={cn(
      'border-b border-secondary-100 px-2 last:border-none',
      className
    )}
    {...props}
  />
));
AccordionItem.displayName = 'AccordionItem';

// Accordtion.Trigger
// ---------------
const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof Primitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof Primitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <Primitive.Header className="flex">
    <Primitive.Trigger
      ref={ref}
      className={cn(
        'flex flex-1 items-center justify-between gap-2 px-2 py-5',
        'font-medium transition-all hover:underline',
        '[&[data-state=open]>svg]:rotate-180',
        'outline-none focus-visible:bg-primary-200/50',
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
    </Primitive.Trigger>
  </Primitive.Header>
));
AccordionTrigger.displayName = Primitive.Trigger.displayName;

// Accordion.Content
// ---------------
const AccordionContent = React.forwardRef<
  React.ElementRef<typeof Primitive.Content>,
  React.ComponentPropsWithoutRef<typeof Primitive.Content>
>(({ className, children, ...props }, ref) => (
  <Primitive.Content
    ref={ref}
    className={cn(
      'overflow-hidden px-2 transition-all',
      'data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down',
      className
    )}
    {...props}
  >
    <div className="pb-4 pt-0">{children}</div>
  </Primitive.Content>
));
AccordionContent.displayName = Primitive.Content.displayName;

// Accordtion
// ---------------
export const Accordion = (
  props: React.ComponentProps<typeof Primitive.Root>
) => <Primitive.Root {...props}></Primitive.Root>;

Accordion.Item = AccordionItem;
Accordion.Trigger = AccordionTrigger;
Accordion.Content = AccordionContent;
