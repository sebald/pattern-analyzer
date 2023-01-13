import { OptionHTMLAttributes, SelectHTMLAttributes } from 'react';

export interface SelectOptionProps
  extends OptionHTMLAttributes<HTMLOptionElement> {
  children: React.ReactNode;
}

const Option = ({ children, ...props }: SelectOptionProps) => (
  <option {...props}>{children}</option>
);

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  children: React.ReactNode;
}

export const Select = ({ children, ...props }: SelectProps) => (
  <select
    {...props}
    className="block w-full cursor-pointer rounded-md border-gray-300 shadow-sm hover:border-primary-400 focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50"
  >
    {children}
  </select>
);

Select.Option = Option;
