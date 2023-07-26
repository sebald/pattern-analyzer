import { ComponentProps } from 'react';
import { cva, VariantProps } from 'class-variance-authority';
import NextLink from 'next/link';

// Styles
// ---------------
const styles = cva(
  [
    'transition-all focus:outline-none focus-visible:ring',
    'disabled:cursor-not-allowed disabled:border-primary-300 disabled:bg-primary-300',
  ],
  {
    variants: {
      variant: {
        default: 'cursor-pointer hover:text-primary-600',
        button: [
          'rounded-lg font-medium border text-center shadow-sm',
          'border-secondary-100 bg-white text-secondary-700',
          'hover:bg-secondary-50 focus-visible:ring-primary-200',
        ],
        highlight: 'opacity-50 hover:opacity-100',
      },
      size: {
        inherit: '', // inherit whatever is there
        regular: 'text-sm px-5 py-2.5',
        large: 'text-lg px-6 py-3',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'inherit',
    },
  }
);

// Props
// ---------------
export interface LinkProps
  extends ComponentProps<typeof NextLink>,
    VariantProps<typeof styles> {}

// Component
// ---------------
export const Link = ({
  children,
  className,
  variant,
  size,
  ...props
}: LinkProps) => (
  <NextLink {...props} className={styles({ variant, size, className })}>
    {children}
  </NextLink>
);
