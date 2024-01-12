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
const styles = {
  select: cva(
    [
      'block appearance-none bg-none rounded-md cursor-pointer',
      'disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500',
    ],
    {
      variants: {
        variant: {
          default: [
            'bg-white border-secondary-200 shadow-sm',
            'hover:border-primary-400 focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50',
          ],
          flat: [
            'bg-secondary-100 border-secondary-100',
            'outline-none focus:ring-transparent focus:border-secondary-300',
          ],
        },
        size: {
          small: 'py-2 text-xs',
          regular: 'py-2',
          large: 'py-3 pl-4 text-xl',
          huge: 'py-5 pl-4 text-xl',
        },
      },
      defaultVariants: {
        variant: 'default',
        size: 'regular',
      },
    }
  ),
  indicator: cva('absolute', {
    variants: {
      variant: {
        default: 'text-secondary-300',
        flat: 'text-secondary-500',
      },
      size: {
        small: 'right-2 top-2.5 h-4 w-4',
        regular: 'right-2 top-3.5 h-4 w-4',
        large: 'right-2.5 top-[18px] h-5 w-5',
        huge: 'right-2.5 top-[22px] h-7 w-7',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'regular',
    },
  }),
};

// Props
// ---------------
export interface SelectProps
  extends VariantProps<typeof styles.select>,
    Omit<React.ComponentPropsWithRef<'select'>, 'size'> {
  label?: React.ReactNode;
  htmlSize?: React.ComponentPropsWithRef<'select'>['size'];
  children: React.ReactNode;
}

// Component
// ---------------
export const Select = ({
  label,
  variant,
  size,
  htmlSize,
  className,
  children,
  ...props
}: SelectProps) => {
  const id = useId();

  return (
    <div className="relative">
      {label && (
        <Label htmlFor={id} size={size}>
          {label}
        </Label>
      )}
      <select
        {...props}
        id={id}
        className={styles.select({ variant, size, className })}
        size={htmlSize}
      >
        {children}
      </select>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        fill="currentColor"
        className={styles.indicator({ variant, size })}
      >
        <path
          fillRule="evenodd"
          d="M5.22 10.22a.75.75 0 0 1 1.06 0L8 11.94l1.72-1.72a.75.75 0 1 1 1.06 1.06l-2.25 2.25a.75.75 0 0 1-1.06 0l-2.25-2.25a.75.75 0 0 1 0-1.06ZM10.78 5.78a.75.75 0 0 1-1.06 0L8 4.06 6.28 5.78a.75.75 0 0 1-1.06-1.06l2.25-2.25a.75.75 0 0 1 1.06 0l2.25 2.25a.75.75 0 0 1 0 1.06Z"
          clipRule="evenodd"
        />
      </svg>
    </div>
  );
};

Select.Option = Option;
