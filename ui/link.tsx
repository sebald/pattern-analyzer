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
          'font-medium border text-center inline-block',
          'border-secondary-100 bg-white text-secondary-700',
          'hover:bg-secondary-50 focus-visible:ring-primary-200',
        ],
        cta: [
          'font-medium border text-center',
          'border-primary-500 bg-primary-500 text-white',
          'hover:border-primary-700 hover:bg-primary-700 focus-visible:ring-primary-200',
        ],
        highlight: 'opacity-50 hover:opacity-100',
      },
      size: {
        inherit: '', // inherit whatever is there
        small: 'text-xs px-2 py-1',
        regular: 'text-sm px-5 py-2.5',
        large: 'text-lg px-6 py-3',
      },
    },
    compoundVariants: [
      {
        variant: 'button',
        size: 'regular',
        className: 'rounded-lg shadow-sm',
      },
      {
        variant: 'button',
        size: 'small',
        className: 'rounded',
      },
      {
        variant: 'cta',
        size: 'regular',
        className: 'rounded-lg shadow-sm',
      },
      {
        variant: 'cta',
        size: 'large',
        className: 'rounded-lg shadow-sm',
      },
    ],
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
