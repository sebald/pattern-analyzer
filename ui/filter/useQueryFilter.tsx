'use client';

// import { useTransition } from 'react';
// import type { ReactNode } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

// Hook
// ---------------
export const useQueryFilter = <Params extends string>(keys: Params[]) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filter = {} as { [param in Params]: string | null };
  keys.forEach(key => {
    filter[key] = searchParams.get(key) || null;
  });

  const setFilter = (values: { [key: string]: string | null }) => {
    const filterParams = new URLSearchParams(searchParams.toString());

    Object.entries(values).forEach(([key, value]) => {
      if (value) {
        filterParams.set(key, value);
      } else {
        filterParams.delete(key);
      }
    });

    const ps = filterParams.toString();
    const queryString = `${ps.length ? '?' : ''}${ps}`;

    router.replace(`${pathname}${queryString}`, { scroll: false });
  };

  return [filter, setFilter] as const;
};
