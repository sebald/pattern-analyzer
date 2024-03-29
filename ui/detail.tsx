import type { ReactNode } from 'react';
import { type VariantProps, cva } from 'class-variance-authority';
import { cn } from '@/lib/utils/classname.utils';

// Helpers
// ---------------
const getHighlight = (value = 0) => {
  if (value > 0) {
    return 'positive';
  }
  if (value < 0) {
    return 'negative';
  }
  return null;
};

// Styles
// ---------------
const styles = {
  container: cva('', {
    variants: {
      align: {
        left: 'flex items-center justify-between gap-4',
      },
      variant: {
        default: '',
        primary: '',
      },
      size: {
        default: '',
        large: '',
        xlarge: '',
        fit: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }),
  label: cva('font-medium leading-none', {
    variants: {
      variant: {
        default: 'text-secondary-400',
        primary: 'text-primary-500',
      },
      size: {
        default: 'text-sm',
        large: 'text-sm',
        xlarge: 'text-base',
        fit: 'text-sm',
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
        default: 'text-secondary-950',
        primary: 'text-secondary-700',
      },
      size: {
        default: 'text-lg font-medium',
        large: 'text-2xl font-medium',
        xlarge: 'text-3xl font-medium',
        fit: 'text-sm font-medium',
      },
      highlight: {
        neutral: '',
        positive: 'text-green-700',
        negative: 'text-red-700',
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
  className?: {
    container?: string;
    label?: string;
    value?: string;
  };
  label: ReactNode;
  value: ReactNode;
  highlight?: number;
}

// Component
// ---------------
export const Detail = ({
  label,
  value,
  variant,
  size,
  align,
  highlight,
  className,
}: DetailProps) => (
  <div
    className={cn(
      styles.container({ variant, size, align }),
      className?.container
    )}
  >
    <div className={cn(styles.label({ variant, size }), className?.label)}>
      {label}
    </div>
    <div
      className={cn(
        styles.value({ variant, size, highlight: getHighlight(highlight) }),
        className?.value
      )}
    >
      {value}
    </div>
  </div>
);
