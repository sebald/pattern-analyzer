import { cva, VariantProps } from 'class-variance-authority';
import { useId } from 'react';
import { Label } from './label';

// Select.Option
// ---------------
export interface SelectOptionProps
  extends React.ComponentPropsWithRef<'option'> {
  children: React.ReactNode;
}

const Option = ({ children, ...props }: SelectOptionProps) => (
  <option {...props}>{children}</option>
);

// Styles
// ---------------
const styles = cva(
  [
    'block cursor-pointer rounded-md border-secondary-200 shadow-sm',
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
        huge: 'py-5 pl-4 text-xl',
      },
    },
    defaultVariants: {
      size: 'regular',
    },
  }
);

// Props
// ---------------
export interface SelectProps
  extends VariantProps<typeof styles>,
    Omit<React.ComponentPropsWithRef<'select'>, 'size'> {
  label?: React.ReactNode;
  htmlSize?: React.ComponentPropsWithRef<'select'>['size'];
  children: React.ReactNode;
}

// Component
// ---------------
export const Select = ({
  label,
  size,
  htmlSize,
  className,
  children,
  ...props
}: SelectProps) => {
  const id = useId();

  return (
    <div>
      {label && (
        <Label htmlFor={id} size={size}>
          {label}
        </Label>
      )}
      <select
        {...props}
        id={id}
        className={styles({ size, className })}
        size={htmlSize}
      >
        {children}
      </select>
    </div>
  );
};

Select.Option = Option;
