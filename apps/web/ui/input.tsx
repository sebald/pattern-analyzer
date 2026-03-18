import { cva, VariantProps } from 'class-variance-authority';
import React, { useId } from 'react';

import { cn } from '@/lib/utils/classname.utils';
import { Label } from './label';

// Styles
// ---------------
const styles = cva(
  [
    'block w-full placeholder:italic',
    'focus:ring focus:ring-opacity-50',
    'disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500',
  ],
  {
    variants: {
      variant: {
        default: [
          'rounded-md shadow-sm',
          'border-secondary-200 hover:border-primary-400',
          'focus:border-primary-300 focus:ring-primary-200',
        ],
        flat: [
          'rounded-md',
          'bg-secondary-100 border-secondary-100 placeholder:text-secondary-400',
          'outline-none focus:ring-transparent focus:border-secondary-300',
        ],
        transparent: [
          'border-transparent',
          'focus:ring-0 focus:bg-secondary-50 focus:border-secondary-50',
        ],
        error: ['border-red-400 focus:border-red-400 focus:ring-red-300'],
      },
      size: {
        small: 'py-2 text-xs',
        regular: 'py-2',
        large: 'py-3 text-xl',
        huge: 'py-5 px-4 text-xl',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'regular',
    },
  }
);

// Props
// ---------------
export interface InputProps
  extends VariantProps<typeof styles>,
    Omit<React.ComponentPropsWithoutRef<'input'>, 'size'> {
  label?: React.ReactNode;
  htmlSize?: React.ComponentPropsWithoutRef<'input'>['size'];
  error?: React.ReactNode;
}

// Component
// ---------------
export const Input = ({
  label,
  type = 'text',
  htmlSize,
  error,
  variant,
  size,
  className,
  ...props
}: InputProps) => {
  const id = useId();

  return (
    <div>
      {label && <Label htmlFor={id}>{label}</Label>}
      <input
        {...props}
        id={id}
        className={cn(
          styles({ size, variant: error ? 'error' : variant }),
          className
        )}
        autoComplete="off"
        size={htmlSize}
        type={type}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};
