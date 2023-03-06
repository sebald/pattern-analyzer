import { cn } from 'lib/utils';

// Stat.Label
// ---------------
interface StatLabelProps {
  className?: string;
  children: React.ReactNode;
}

const StatLabel = ({ className, children }: StatLabelProps) => (
  <div className={cn(className)}>{children}</div>
);

// Stat.Label
// ---------------
interface StatValueProps {
  className?: string;
  children: React.ReactNode;
}

const StatValue = ({ className, children }: StatValueProps) => (
  <div className={cn('tabular-nums text-secondary-400', className)}>
    {children}
  </div>
);

// Stat
// ---------------
interface StatProps {
  className?: string;
  children: React.ReactNode;
}

export const Stat = ({ className, children }: StatProps) => (
  <div className={cn('flex flex-row items-center gap-1 text-xs', className)}>
    {children}
  </div>
);

Stat.Label = StatLabel;
Stat.Value = StatValue;
