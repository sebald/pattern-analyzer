'use client';

import type { ReactNode } from 'react';

import { Inline } from '../inline';
import { Spinner } from '../spinner';
import { ParamsProvier, useParamsContext } from './useParams';

const Loading = () => {
  const { pending } = useParamsContext();
  return pending ? <Spinner className="h-4 w-4" /> : null;
};

export const Filter = ({ children }: { children?: ReactNode }) => (
  <Inline className="gap-2 pb-8 sm:gap-4" align="end">
    <ParamsProvier>
      <Loading />
      {children}
    </ParamsProvier>
  </Inline>
);
