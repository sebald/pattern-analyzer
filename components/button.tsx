import { cva, VariantProps } from 'class-variance-authority';
import { ButtonHTMLAttributes } from 'react';

// Styles
// ---------------
const styles = cva(
  [
    'rounded-lg border text-center font-medium shadow-sm',
    'transition-all',
    'focus:ring',
    'disabled:cursor-not-allowed disabled:border-primary-300 disabled:bg-primary-300',
  ],
  {
    variants: {
      variant: {
        default: [
          'border-secondary-100 bg-white text-secondary-700',
          'hover:bg-secondary-50 focus:ring-primary-200',
        ],
        primary: [
          'border-primary-500 bg-primary-500 text-white',
          'hover:border-primary-700 hover:bg-primary-700 focus:ring-primary-200',
        ],
        error: [
          'border-red-500 bg-red-500 text-white',
          'hover:border-red-700 hover:bg-red-700 focus:ring-red-200',
        ],
      },
      size: {
        regular: 'text-sm px-5 py-2.5',
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
    ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

// Component
// ---------------
export const Button = ({
  variant = 'default',
  size = 'regular',
  type = 'button',
  children,
  ...props
}: ButtonProps) => (
  <button {...props} type={type} className={styles({ variant, size })}>
    {children}
  </button>
);
