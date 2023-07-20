import type { ReactNode } from 'react';
import { VariantProps, cva } from 'class-variance-authority';

// Styles
// ---------------
const styles = cva(
  'inline-flex items-center rounded-lg py-1 px-2 leading-none text-sm font-medium',
  {
    variants: {
      variant: {
        default: 'bg-primary-800 text-primary-50',
        light: 'bg-primary-100 text-primary-800',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

// Props
// ---------------
export interface BadgeProps extends VariantProps<typeof styles> {
  children?: ReactNode;
}

// Component
// ---------------
export const Badge = ({ children, variant }: BadgeProps) => (
  <div className={styles({ variant })}>{children}</div>
);
