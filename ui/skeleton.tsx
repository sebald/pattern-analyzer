import { cn } from '@/lib/utils';

import { Card } from './card';
import { Logo, LogoProps } from './logo';

export const Skeleton = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => (
  <div className={cn('animate-pulse', className)}>
    {children}
    <span className="sr-only">Loading...</span>
  </div>
);

// Loading: Headline
// ---------------
export const HeadlineSkeleton = ({ className }: { className?: string }) => (
  <div
    className={cn('mb-2 h-3 w-3/5 rounded-xl bg-secondary-100', className)}
  />
);

// Loading: Line
// ---------------
export const LineSkeleton = ({ className }: { className?: string }) => (
  <div className={cn('h-2 rounded-xl bg-secondary-50', className)} />
);

// Loading: Content
// ---------------
export const ContentSkeleton = ({ lines = 3 }) => (
  <div className="flex flex-col gap-1.5">
    <HeadlineSkeleton />
    {Array.from({ length: lines - 1 }, (_, i) => i + 1).map(line => (
      <LineSkeleton key={line} />
    ))}
    <LineSkeleton className="last:w-4/5" />
  </div>
);

// Loading: Chart
// ---------------
export const ChartSkeleton = () => (
  <div className="flex h-72 items-center justify-center rounded bg-secondary-100 text-secondary-300">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1}
      stroke="currentColor"
      className="h-12 w-12"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
      />
    </svg>
  </div>
);

// Loading: Logo
// ---------------
export const LogoSkeleton = ({ className, ...props }: LogoProps) => (
  <Logo
    className={cn('h-20 w-20 animate-pulse', className)}
    strokeWidth={1.5}
    {...props}
  />
);

// Loading: Card with Content
// ---------------
export interface CardSkeletonProps {
  lines?: [number, number, number];
}

export const CardSkeleton = ({ lines = [3, 2, 2] }: CardSkeletonProps) => (
  <Card role="status" className="animate-pulse" elevation="lightest">
    <ContentSkeleton lines={lines[0]} />
    <ContentSkeleton lines={lines[1]} />
    <ContentSkeleton lines={lines[2]} />
  </Card>
);

// Loading: Chart with Card
// ---------------
export const CardChartSkeleton = () => (
  <Card role="status" className="animate-pulse" elevation="light">
    <ChartSkeleton />
    <Card.Footer>
      <div className="grid grid-cols-2 gap-4 px-1 pt-2 lg:grid-cols-3">
        <LineSkeleton className="w-5/6" />
        <LineSkeleton className="w-4/5" />
        <LineSkeleton className="w-4/6" />
        <LineSkeleton className="w-9/12" />
        <LineSkeleton className="w-7/12" />
        <LineSkeleton className="w-4/5" />
      </div>
    </Card.Footer>
  </Card>
);
