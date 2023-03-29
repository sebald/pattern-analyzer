'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from './button';

export interface CollapsibleProps {
  defaultCollapsed?: boolean;
  maxHeight: number;
  children: React.ReactNode;
}

export const Collapsible = ({
  defaultCollapsed = true,
  maxHeight,
  children,
}: CollapsibleProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const height = useRef(-1);
  const [collapsed, setCollapsed] = useState(false);

  /**
   * Run the initial setup only once, this means that
   * `maxHeight` and `defaultCollapsed` can not be updated
   * dynamically.
   */
  useEffect(() => {
    height.current = ref.current?.clientHeight || 0;
    if (defaultCollapsed && height.current > maxHeight) {
      setCollapsed(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * If the content is smaller than the set maxHeight,
   * just render the children and don't wrap anything
   * in the collapsable container.
   */
  if (height.current > maxHeight) {
    return <>{children}</>;
  }

  const styles = {
    '--collapsible-height': `${maxHeight}px`,
  } as React.CSSProperties;

  return (
    <div className="flex flex-col gap-4">
      <div
        ref={ref}
        style={styles}
        className={
          collapsed ? 'max-h-[var(--collapsible-height)] overflow-hidden' : ''
        }
      >
        {children}
      </div>
      <div className="flex justify-center">
        <Button
          variant="link"
          size="inherit"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? 'Show more' : 'Show less'}
        </Button>
      </div>
    </div>
  );
};
