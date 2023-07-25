import type { ReactNode } from 'react';
import { type VariantProps, cva } from 'class-variance-authority';

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
        small: '',
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
        secondary: 'text-secondary-900',
      },
      size: {
        default: '',
        small: '',
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
        secondary: 'text-secondary-400',
      },
      size: {
        default: 'text-2xl font-medium',
        small: 'text-sm',
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
  label: ReactNode;
  value: ReactNode;
}

// Component
// ---------------
export const Detail = ({ label, value, variant, size, align }: DetailProps) => (
  <div className={styles.container({ variant, size, align })}>
    <div className={styles.label({ variant, size })}>{label}</div>
    <div className={styles.value({ variant, size })}>{value}</div>
  </div>
);
