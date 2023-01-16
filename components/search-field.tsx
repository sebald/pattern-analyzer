import { InputHTMLAttributes, useId } from 'react';
import { Label } from './label';

export interface SearchFieldProps
  extends InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
}

export const SearchField = ({ label, ...props }: SearchFieldProps) => {
  const id = useId();

  return (
    <div>
      {label && <Label htmlFor={id}>{label}</Label>}
      <div className="relative">
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
        <input
          {...props}
          id={id}
          className="block rounded-md border-secondary-200 pl-8 text-xs shadow-sm focus:border-primary-400 focus:ring focus:ring-primary-300 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500"
          type="search"
          autoComplete="off"
        />
      </div>
    </div>
  );
};
