'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { createContext, useContext, useTransition } from 'react';
import type { ReactNode, TransitionStartFunction } from 'react';

// Context
// ---------------
const Context = createContext<{
  pending: boolean;
  startTransition: TransitionStartFunction;
}>({} as any);

export const useParamsContext = () => useContext(Context);

// Provider
// ---------------
export const ParamsProvier = ({ children }: { children?: ReactNode }) => {
  const [pending, startTransition] = useTransition();

  return (
    <Context.Provider value={{ pending, startTransition }}>
      {children}
    </Context.Provider>
  );
};

// Hook
// ---------------
export const useParams = <Params extends string>(keys: Params[]) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { startTransition } = useParamsContext();

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

    startTransition(() => {
      router.replace(`${pathname}${queryString}`, { scroll: false });
    });
  };

  return [params, setParams] as const;
};
