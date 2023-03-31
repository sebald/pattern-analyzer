import { cn } from '@/lib/utils';

export interface InlineProps {
  className?: string;
  children: React.ReactNode;
}

export const Inline = ({ className, children }: InlineProps) => (
  <div className={cn('flex flex-wrap items-center gap-1', className)}>
    {children}
  </div>
);
