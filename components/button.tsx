import { cva, VariantProps } from 'class-variance-authority';

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
        default: [
          'font-medium rounded-lg border text-center shadow-sm',
          'border-secondary-100 bg-white text-secondary-700',
          'hover:bg-secondary-50 focus:ring-primary-200',
        ],
        primary: [
          'font-medium rounded-lg border text-center shadow-sm',
          'border-primary-500 bg-primary-500 text-white',
          'hover:border-primary-700 hover:bg-primary-700 focus:ring-primary-200',
        ],
        link: [
          'flex flex-row gap-1 items-center',
          'cursor-pointer hover:text-primary-600',
        ],
        error: [
          'font-medium rounded-lg border text-center shadow-sm',
          'border-red-500 bg-red-500 text-white',
          'hover:border-red-700 hover:bg-red-700 focus:ring-red-200',
        ],
      },
      size: {
        inherit: '', // inherit whatever is there
        regular: 'text-sm px-5 py-2.5',
        large: 'text-lg px-6 py-3',
        huge: 'text-xl px-12 py-5',
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
export const Button = ({
  variant = 'default',
  size = 'regular',
  type = 'button',
  className,
  children,
  ...props
}: ButtonProps) => (
  <button
    {...props}
    type={type}
    className={styles({ variant, size, className })}
  >
    {children}
  </button>
);
