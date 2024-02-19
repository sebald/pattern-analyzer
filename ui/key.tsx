import type { ReactNode } from 'react';

const FONT_SIZE_MAP = {
  xxs: 'text-[10px]',
  xs: 'text-xs',
};

// Props
// ---------------
export interface KeyProps {
  children: ReactNode;
  size?: 'xxs' | 'xs';
}

// Components
// ---------------
export const Key = ({ children, size = 'xxs' }: KeyProps) => (
  <kbd
    className={`pointer-events-none grid h-5 select-none place-items-center rounded border border-secondary-100 bg-white px-1.5 font-mono font-medium leading-none text-secondary-400 shadow-sm ${FONT_SIZE_MAP[size]}`}
  >
    {children}
  </kbd>
);
