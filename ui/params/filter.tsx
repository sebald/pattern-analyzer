'use client';

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/classname.utils';

import { Inline } from '../inline';
import { Spinner } from '../spinner';
import { ParamsProvier, useParamsContext } from './useParams';

const Loading = () => {
  const { pending } = useParamsContext();
  return pending ? <Spinner className="h-4 w-4" /> : null;
};

// Props
// ---------------
export interface FilterProps {
  className?: string;
  children?: ReactNode;
}

// Component
// ---------------
export const Filter = ({ className, children }: FilterProps) => (
  <Inline className={cn('h-full gap-2 pb-6 sm:gap-4', className)} align="end">
    <ParamsProvier>
      <Loading />
      {children}
    </ParamsProvier>
  </Inline>
);
