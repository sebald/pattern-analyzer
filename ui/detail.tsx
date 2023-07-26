import type { ReactNode } from 'react';
import { type VariantProps, cva } from 'class-variance-authority';
import { cn } from '@/lib/utils/classname.utils';

// Styles
// ---------------
const styles = {
  container: cva('', {
    variants: {
      align: {
        left: 'flex items-center justify-between gap-2',
      },
      variant: {
        default: '',
        secondary: '',
      },
      size: {
        default: '',
        large: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }),
  label: cva('text-sm font-medium leading-none', {
    variants: {
      variant: {
        default: 'text-primary-500',
        secondary: 'text-secondary-400',
      },
      size: {
        default: '',
        large: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }),
  value: cva('', {
    variants: {
      variant: {
        default: 'text-secondary-700',
        secondary: 'text-secondary-950',
      },
      size: {
        default: 'text-lg font-medium',
        large: 'text-2xl font-medium',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }),
};

// Props
// ---------------
export interface DetailProps extends VariantProps<typeof styles.container> {
  className?: string;
  label: ReactNode;
  value: ReactNode;
}

// Component
// ---------------
export const Detail = ({
  label,
  value,
  variant,
  size,
  align,
  className,
}: DetailProps) => (
  <div className={cn(styles.container({ variant, size, align }), className)}>
    <div className={cn(styles.label({ variant, size }), className)}>
      {label}
    </div>
    <div className={cn(styles.value({ variant, size }), className)}>
      {value}
    </div>
  </div>
);
