import { cva, VariantProps } from 'class-variance-authority';
import { InputHTMLAttributes, useId } from 'react';

import { Label } from './label';

// Styles
// ---------------
const styles = cva(
  [
    'block w-full rounded-md shadow-sm',
    'focus:ring focus:ring-opacity-50',
    'disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500',
  ],
  {
    variants: {
      variant: {
        default: [
          'border-secondary-200 hover:border-primary-400',
          'focus:border-primary-300 focus:ring-primary-200',
        ],
        error: ['border-red-400 focus:border-red-400 focus:ring-red-300'],
      },
      size: {
        small: 'py-2 text-xs',
        regular: 'py-2',
        large: 'py-3 text-xl',
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
export interface InputProps
  extends VariantProps<typeof styles>,
    Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: React.ReactNode;
  htmlSize?: InputHTMLAttributes<HTMLInputElement>['size'];
  error?: React.ReactNode;
}

// Component
// ---------------
export const Input = ({
  label,
  type = 'text',
  htmlSize,
  error,
  variant,
  size,
  ...props
}: InputProps) => {
  const id = useId();
  console.log(error ? 'error' : variant);
  return (
    <div>
      {label && <Label htmlFor={id}>{label}</Label>}
      <input
        {...props}
        id={id}
        className={styles({ size, variant: error ? 'error' : variant })}
        autoComplete="off"
        size={htmlSize}
        type={type}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};
