'use client';

import { createContext, forwardRef, useContext } from 'react';
import type {
  ComponentPropsWithoutRef,
  ElementRef,
  ForwardRefExoticComponent,
} from 'react';
import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group';
import { cva } from 'class-variance-authority';
import type { VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

// Styles
// ---------------
const styles = {
  group: cva(
    [
      'inline-flex -space-x-0 overflow-hidden',
      'rounded-md border border-secondary-200 shadow-sm divide-x divide-secondary-200',
      'disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500',
    ],
    {
      variants: {
        variant: {
          default: '',
        },
        size: {
          small: '',
          default: '',
        },
      },
      defaultVariants: {
        variant: 'default',
        size: 'default',
      },
    }
  ),
  item: cva(
    [
      'bg-white text-center text-secondary-700',
      'hover:bg-secondary-50',
      'outline-none focus:bg-secondary-50',
      'data-[state=on]:text-secondary-900 data-[state=on]:font-medium data-[state=on]:bg-secondary-50',
    ],
    {
      variants: {
        variant: {
          default: '',
        },
        size: {
          small: 'py-2 px-3 text-xs',
          default: 'px-4 py-2.5 text-sm font-medium',
        },
      },
      defaultVariants: {
        variant: 'default',
        size: 'default',
      },
    }
  ),
};

// 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors',
// 'hover:bg-muted hover:text-muted-foreground',
// 'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
// 'disabled:pointer-events-none disabled:opacity-50',
// 'data-[state=on]:bg-accent data-[state=on]:text-accent-foreground',

// Context
// ---------------
const ToggleGroupContext = createContext<VariantProps<typeof styles.group>>({
  size: 'default',
  variant: 'default',
});

// Item
// ---------------
const ToggleGroupItem = forwardRef<
  ElementRef<typeof ToggleGroupPrimitive.Item>,
  ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item> &
    VariantProps<typeof styles.group>
>(({ className, children, variant, size, ...props }, ref) => {
  const context = useContext(ToggleGroupContext);

  return (
    <ToggleGroupPrimitive.Item
      ref={ref}
      className={cn(
        styles.item({
          variant: context.variant || variant,
          size: context.size || size,
        }),
        className
      )}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  );
});

ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName;

// Props
// ---------------
export type ToggleGroupProps = ComponentPropsWithoutRef<
  typeof ToggleGroupPrimitive.Root
> &
  VariantProps<typeof styles.group>;

// Group
// ---------------
export const ToggleGroup = forwardRef<
  ElementRef<typeof ToggleGroupPrimitive.Root>,
  ToggleGroupProps
>(({ className, variant, size, children, ...props }, ref) => (
  <ToggleGroupPrimitive.Root
    ref={ref}
    className={cn(styles.group({ variant, size }), className)}
    {...props}
  >
    <ToggleGroupContext.Provider value={{ variant, size }}>
      {children}
    </ToggleGroupContext.Provider>
  </ToggleGroupPrimitive.Root>
)) as ToggleGroup;

ToggleGroup.displayName = ToggleGroupPrimitive.Root.displayName;

ToggleGroup.Item = ToggleGroupItem;

export interface ToggleGroup
  extends ForwardRefExoticComponent<ToggleGroupProps> {
  Item: typeof ToggleGroupItem;
}
