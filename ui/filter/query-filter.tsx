'use client';

import { useTransition } from 'react';
import type { ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export interface QueryFilterProps {
  children?: ReactNode;
}

export const QueryFilter = ({ children }: QueryFilterProps) => {
  const { replace } = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();

  console.log(pathname);

  return <>{children}</>;
};
