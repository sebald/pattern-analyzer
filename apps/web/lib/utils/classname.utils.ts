import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Conditionally apply classnames and merge tailwind classnames.
 */
export const cn = (...values: ClassValue[]) => twMerge(clsx(values));
