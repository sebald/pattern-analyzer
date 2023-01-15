import cn from 'clsx';

import { ButtonHTMLAttributes } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'error';
  children: React.ReactNode;
}

export const Button = ({
  variant = 'default',
  type = 'button',
  children,
  ...props
}: ButtonProps) => (
  <button
    {...props}
    type={type}
    className={cn(
      'rounded-lg border px-5 py-2.5 text-center text-sm font-medium shadow-sm transition-all focus:ring disabled:cursor-not-allowed disabled:border-primary-300 disabled:bg-primary-300',
      variant === 'default' &&
        'border-secondary-100 bg-white text-secondary-700 hover:bg-secondary-50 focus:ring-primary-200',
      variant === 'primary' &&
        'border-primary-500 bg-primary-500 text-white hover:border-primary-700 hover:bg-primary-700 focus:ring-primary-200',
      variant === 'error' &&
        'border-red-500 bg-red-500 text-white hover:border-red-700 hover:bg-red-700 focus:ring-red-200'
    )}
  >
    {children}
  </button>
);
