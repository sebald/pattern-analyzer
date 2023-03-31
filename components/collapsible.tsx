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
  defaultCollapsed?: boolean;
  maxHeight: number;
  children: React.ReactElement;
}

// Component
// ---------------
export const Collapsible = ({
  defaultCollapsed = true,
  maxHeight,
  children,
}: CollapsibleProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [ref, { x, height }] = useMeasure<HTMLDivElement>();
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const child = cloneElement(children, { ...children.props, ref });

  const toggle = () => {
    setCollapsed(!collapsed);
    if (!collapsed && window) {
      // window.scrollTo({ top: x, behavior: 'smooth' });
      wrapperRef?.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
      window.scrollTo({
        behavior: 'smooth',
        top:
          document.querySelector(selector).getBoundingClientRect().top -
          document.body.getBoundingClientRect().top -
          offset,
      });
    }
  };

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
        <div className="flex justify-center">
          <button className={styles.toggle()} onClick={toggle}>
            <Expand className="h-4 w-4" strokeWidth={2.5} />
            {collapsed ? 'Show more' : 'Show less'}
          </button>
        </div>
      }
    </div>
  );
};
