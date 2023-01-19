import { cva, VariantProps } from 'class-variance-authority';
import { InputHTMLAttributes, useId } from 'react';

import { Label } from './label';

// Styles
// ---------------
const styles = cva(
  [
    'block w-full rounded-md shadow-sm border-secondary-200',
    'hover:border-primary-400',
    'focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50',
    'disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500',
  ],
  {
    variants: {
      size: {
        small: 'py-2 text-xs',
        regular: 'py-2',
        large: 'py-3 text-xl',
      },
    },
    defaultVariants: {
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
}

// Component
// ---------------
export const Input = ({
  label,
  size,
  type = 'text',
  htmlSize,
  ...props
}: InputProps) => {
  const id = useId();

  return (
    <div>
      {label && <Label htmlFor={id}>{label}</Label>}
      <input
        {...props}
        id={id}
        className={styles({ size })}
        autoComplete="off"
        size={htmlSize}
        type={type}
      />
    </div>
  );
};
