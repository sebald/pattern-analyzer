import { cn } from 'lib/utils';

export interface DividerProps {
  className?: string;
  orientation?: 'horizontal' | 'vertical';
}

export const Divider = ({
  className,
  orientation = 'horizontal',
}: DividerProps) => (
  <div
    className={cn(
      'bg-secondary-100',
      orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]',
      className
    )}
  />
);
