import { cva, VariantProps } from 'class-variance-authority';
import { forwardRef } from 'react';

// Styles
// ---------------
const styles = cva(
  [
    'transition-all focus:outline-none focus-visible:ring',
    'disabled:cursor-not-allowed disabled:border-primary-300/25 disabled:bg-primary-300/50',
  ],
  {
    variants: {
      variant: {
        default: [
          'font-medium border text-center',
          'border-secondary-100 bg-white text-secondary-700',
          'hover:bg-secondary-50 focus-visible:ring-primary-200',
        ],
        primary: [
          'font-medium border text-center',
          'border-primary-500 bg-primary-500 text-white',
          'hover:border-primary-700 hover:bg-primary-700 focus-visible:ring-primary-200',
        ],
        link: [
          'flex flex-row gap-1 items-center',
          'cursor-pointer hover:text-primary-600',
        ],
        sunken: ['bg-primary-100 text-primary-700', 'hover:bg-primary-200/60'],
        error: [
          'font-medium border text-center',
          'border-red-500 bg-red-500 text-white',
          'hover:border-red-700 hover:bg-red-700 focus-visible:ring-red-200',
        ],
      },
      size: {
        inherit: '', // inherit whatever is there
        small: 'rounded text-xs px-2 py-1',
        medium: 'rounded-lg text-sm px-3 py-2',
        regular: 'rounded-lg text-sm px-5 py-2.5 shadow-sm',
        large: 'rounded-lg text-lg px-6 py-3 shadow',
        huge: 'rounded-lg text-xl px-12 py-5 shadow',
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
export interface ButtonProps
  extends VariantProps<typeof styles>,
    React.ComponentPropsWithoutRef<'button'> {
  className?: string;
  children: React.ReactNode;
}

// Component
// ---------------
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'default',
      size = 'regular',
      type = 'button',
      className,
      children,
      ...props
    },
    ref
  ) => (
    <button
      {...props}
      type={type}
      className={styles({ variant, size, className })}
      ref={ref}
    >
      {children}
    </button>
  )
);

Button.displayName = 'Button';
