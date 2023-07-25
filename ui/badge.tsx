import type { ReactNode } from 'react';
import { VariantProps, cva } from 'class-variance-authority';
import { cn } from '@/lib/utils/classname.utils';

// Styles
// ---------------
const styles = cva(
  'inline-flex items-center rounded-lg py-1 px-2 leading-none',
  {
    variants: {
      variant: {
        default: 'bg-primary-800 text-primary-50',
        light: 'bg-primary-100 text-primary-800',
        neutral: 'bg-secondary-100/50 text-secondary-500',
      },
      size: {
        default: 'text-sm font-medium',
        small: 'text-xs',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

// Props
// ---------------
export interface BadgeProps extends VariantProps<typeof styles> {
  className?: string;
  children?: ReactNode;
}

// Component
// ---------------
export const Badge = ({ className, variant, size, children }: BadgeProps) => (
  <div className={cn(styles({ variant, size }), className)}>{children}</div>
);
