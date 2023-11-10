import { cn } from '@/lib/utils';

export interface InlineProps {
  align?: 'start' | 'end';
  className?: string;
  children: React.ReactNode;
}

export const Inline = ({ align, className, children }: InlineProps) => (
  <div
    className={cn(
      'flex flex-wrap items-center gap-1',
      align === 'end' && 'justify-end',
      className
    )}
  >
    {children}
  </div>
);
