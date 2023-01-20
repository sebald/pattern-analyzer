import { cva, VariantProps } from 'class-variance-authority';
import { useId } from 'react';

import { Label } from './label';

// Styles
// ---------------
const styles = cva(
  [
    'block w-full rounded-md shadow-sm border-secondary-200',
    'hover:border-primary-400',
    'focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50',
    'disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500',
    'pl-8', // padding for icon
    'pr-3', // padding for close button
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

// Icon
// ---------------
const SearchIcon = () => (
  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-2.5">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="h-4 w-4 text-secondary-700"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
      />
    </svg>
  </div>
);

// Props
// ---------------
export interface SearchFieldProps
  extends VariantProps<typeof styles>,
    Omit<React.ComponentPropsWithRef<'input'>, 'size'> {
  label?: React.ReactNode;
  htmlSize?: React.ComponentPropsWithRef<'input'>['size'];
}

// Component
// ---------------
export const SearchField = ({
  label,
  size,
  htmlSize,
  ...props
}: SearchFieldProps) => {
  const id = useId();

  return (
    <div>
      {label && <Label htmlFor={id}>{label}</Label>}
      <div className="relative">
        <SearchIcon />
        <input
          {...props}
          id={id}
          className={styles({ size })}
          type="search"
          autoComplete="off"
          size={htmlSize}
        />
      </div>
    </div>
  );
};
