'use client';

import { cloneElement, useRef, useState } from 'react';
import useMeasure from 'react-use/lib/useMeasure';
import { cva } from 'class-variance-authority';
import { Expand } from './icons';

// Styles
// ---------------
const styles = {
  wrapper: cva(['relative'], {
    variants: {
      collapsed: {
        true: 'max-h-[var(--collapsible-height)] overflow-hidden',
      },
    },
  }),
  gradient: cva([
    'absolute bottom-0 left-0 right-0',
    'h-14',
    'bg-gradient-to-t from-white',
  ]),
  toggle: cva([
    'flex gap-0.5 items-center',
    'text-sm text-primary-700 font-semibold',
    'py-1.5 px-6 rounded-lg',
    'bg-primary-50 hover:bg-primary-100',
  ]),
};

// Props
// ---------------
export interface CollapsibleProps {
  maxHeight: number;
  defaultCollapsed?: boolean;
  scrollOffset?: number;
  children: React.ReactElement;
}

// Component
// ---------------
export const Collapsible = ({
  defaultCollapsed = true,
  scrollOffset = 150,
  maxHeight,
  children,
}: CollapsibleProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [ref, { height }] = useMeasure<HTMLDivElement>();
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const child = cloneElement(children, { ...children.props, ref });

  const toggle = () => {
    setCollapsed(!collapsed);
    if (!collapsed && wrapperRef && window) {
      window.scrollTo({
        top:
          wrapperRef.current?.getBoundingClientRect().top! -
          document.body.getBoundingClientRect().top -
          scrollOffset,
      });
    }
  };

  /**
   * Do not wrap into collapsible if the element is not
   * larger than given max height.
   */
  if (height <= maxHeight) {
    return <>{child}</>;
  }

  const vars = {
    '--collapsible-height': `${maxHeight}px`,
  } as React.CSSProperties;

  return (
    <div className="flex flex-col" ref={wrapperRef}>
      <div style={vars} className={styles.wrapper({ collapsed })}>
        {child}
        {collapsed && <div className={styles.gradient()} />}
      </div>
      {
        <div className="flex justify-center pt-2">
          <button className={styles.toggle()} onClick={toggle}>
            <Expand className="h-4 w-4" strokeWidth={2.5} />
            {collapsed ? 'Show more' : 'Show less'}
          </button>
        </div>
      }
    </div>
  );
};
