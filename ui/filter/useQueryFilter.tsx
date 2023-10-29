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

  const setFilter = (key: string, value: string) => {
    const filterParams = new URLSearchParams(searchParams.toString());
    filterParams.set(key, value);

    const ps = filterParams.toString();
    const queryString = `${ps.length ? '?' : ''}${ps}`;

    router.replace(`${pathname}${queryString}`, { scroll: false });
  };

  return { filter, setFilter };
};

// export interface QueryFilterProps {
//   children?: ReactNode;
// }

// export const QueryFilter = ({ children }: QueryFilterProps) => {
//   const { replace } = useRouter();
//   const pathname = usePathname();
//   const [pending, startTransition] = useTransition();

//   console.log(pathname);

//   return <>{children}</>;
// };
