'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

// Hook
// ---------------
export const useParams = <Params extends string>(keys: Params[]) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const params = {} as { [param in Params]: string | null };
  keys.forEach(key => {
    params[key] = searchParams.get(key) || null;
  });

  const setParams = (values: { [key: string]: string | null }) => {
    const sp = new URLSearchParams(searchParams.toString());

    Object.entries(values).forEach(([key, value]) => {
      if (value) {
        sp.set(key, value);
      } else {
        sp.delete(key);
      }
    });

    const ps = sp.toString();
    const queryString = `${ps.length ? '?' : ''}${ps}`;

    router.replace(`${pathname}${queryString}`, { scroll: false });
  };

  return [params, setParams] as const;
};
