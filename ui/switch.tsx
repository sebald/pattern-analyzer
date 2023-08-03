'use client';

import {
  forwardRef,
  type ElementRef,
  type ComponentPropsWithoutRef,
  useId,
} from 'react';
import { type VariantProps, cva } from 'class-variance-authority';
import * as SwitchPrimitives from '@radix-ui/react-switch';

import { cn } from '@/lib/utils';
import { Label } from './label';

const styles = {
  root: cva(
    [
      'rounded-full transition-colors border-2 border-transparent',
      'data-[state=checked]:bg-primary-300 data-[state=unchecked]:bg-secondary-100 bg-secondary-100',
      'data-[state=unchecked]:enabled:hover:bg-secondary-200',
      'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-200',
      'disabled:cursor-not-allowed disabled:opacity-50',
    ],
    {
      variants: {
        size: {
          small: 'h-5 w-9',
          regular: 'h-6 w-11',
          large: 'h-8 w-14',
        },
      },
      defaultVariants: {
        size: 'regular',
      },
    }
  ),
  thumb: cva(
    [
      'pointer-events-none block rounded-full bg-white shadow transition-transform',
      'data-[state=unchecked]:translate-x-0',
    ],
    {
      variants: {
        size: {
          small: 'h-4 w-4 data-[state=checked]:translate-x-4',
          regular: 'h-5 w-5 data-[state=checked]:translate-x-5',
          large: 'h-7 w-7 data-[state=checked]:translate-x-6',
        },
      },
      defaultVariants: {
        size: 'regular',
      },
    }
  ),
};

// Props
// ---------------
export interface SwitchProps
  extends VariantProps<typeof styles.root>,
    ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> {
  label?: React.ReactNode;
}

// Component
// ---------------
export const Switch = forwardRef<
  ElementRef<typeof SwitchPrimitives.Root>,
  SwitchProps
>(({ label, size, className, ...props }, ref) => {
  const id = useId();

  return (
    <div className="flex cursor-pointer items-center gap-2">
      {label && (
        <Label htmlFor={id} size={size} className="m-0 select-none font-normal">
          {label}
        </Label>
      )}
      <SwitchPrimitives.Root
        className={cn(styles.root({ size, className }))}
        {...props}
        id={id}
        ref={ref}
      >
        <SwitchPrimitives.Thumb
          className={cn(styles.thumb({ size, className }))}
        />
      </SwitchPrimitives.Root>
    </div>
  );
});

Switch.displayName = SwitchPrimitives.Root.displayName;
