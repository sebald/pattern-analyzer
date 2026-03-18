import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/classname.utils';

// Component
// ---------------
export const Tooltip = ({
  className,
  children,
}: {
  className?: string;
  children?: ReactNode;
}) => (
  <div
    className={cn(
      'rounded border border-secondary-100 bg-white px-3 py-1 text-sm shadow-sm shadow-secondary-600',
      className
    )}
  >
    {children}
  </div>
);
