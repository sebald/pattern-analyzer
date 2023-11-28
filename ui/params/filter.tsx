'use client';

import type { ReactNode } from 'react';

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
  children?: ReactNode;
}

// Component
// ---------------
export const Filter = ({ children }: FilterProps) => (
  <Inline className="gap-2 pb-6 sm:gap-4" align="end">
    <ParamsProvier>
      <Loading />
      {children}
    </ParamsProvier>
  </Inline>
);
