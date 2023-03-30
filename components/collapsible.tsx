'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import useMeasure from 'react-use/lib/useMeasure';

import { Button } from './button';

export interface CollapsibleProps {
  defaultCollapsed?: boolean;
  maxHeight: number;
  children: React.ReactElement;
}

export const Collapsible = ({
  defaultCollapsed = true,
  maxHeight,
  children,
}: CollapsibleProps) => {
  const [ref, { height: currentHeight }] = useMeasure<HTMLDivElement>();
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const height = useRef(0);

  useLayoutEffect(() => {
    if (!height.current) {
      height.current = currentHeight;
    }
  }, [currentHeight]);

  console.log(height);
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
      {height.current > maxHeight ? (
        <div className="flex justify-center">
          <Button
            variant="link"
            size="inherit"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? 'Show more' : 'Show less'}
          </Button>
        </div>
      ) : null}
    </div>
  );
};
