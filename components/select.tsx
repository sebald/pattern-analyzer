import { OptionHTMLAttributes, SelectHTMLAttributes, useId } from 'react';

export interface SelectOptionProps
  extends OptionHTMLAttributes<HTMLOptionElement> {
  children: React.ReactNode;
}

const Option = ({ children, ...props }: SelectOptionProps) => (
  <option {...props}>{children}</option>
);

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: React.ReactNode;
  children: React.ReactNode;
}

export const Select = ({ label, children, ...props }: SelectProps) => {
  const id = useId();

  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1 block text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      <select
        {...props}
        className="block cursor-pointer rounded-md border-gray-300 shadow-sm hover:border-primary-400 focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50"
      >
        {children}
      </select>
    </div>
  );
};

Select.Option = Option;
