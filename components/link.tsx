import { ComponentProps } from 'react';
import { cva, VariantProps } from 'class-variance-authority';
import NextLink from 'next/link';

// Styles
// ---------------
const styles = cva(
  [
    'transition-all focus:ring',
    'disabled:cursor-not-allowed disabled:border-primary-300 disabled:bg-primary-300',
  ],
  {
    variants: {
      variant: {
        default: 'cursor-pointer hover:text-primary-600',
        button: [
          'rounded-lg font-medium border text-center shadow-sm',
          'border-secondary-100 bg-white text-secondary-700',
          'hover:bg-secondary-50 focus:ring-primary-200',
        ],
      },
      size: {
        inherit: '', // inherit whatever is there
        regular: 'text-sm px-5 py-2.5',
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
export interface LinksProps
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
}: LinksProps) => (
  <NextLink {...props} className={styles({ variant, size, className })}>
    {children}
  </NextLink>
);
