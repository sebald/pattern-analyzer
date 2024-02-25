import { useEffect, useState } from 'react';

//https://www.joshwcomeau.com/react/the-perils-of-rehydration/
export const useHasMounted = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  return mounted;
};
