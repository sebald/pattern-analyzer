import { cn } from '@/lib/utils';

import { Card } from './card';
import { Logo, LogoProps } from './logo';

const Content = ({ lines = 3 }) => (
  <div className="flex flex-col gap-1.5">
    <div className="mb-2 h-3 w-3/5 rounded-xl bg-secondary-200" />
    {Array.from({ length: lines - 1 }, (_, i) => i + 1).map(line => (
      <div key={line} className="h-2 rounded-xl bg-secondary-100" />
    ))}
    <div className="mb-4 h-2 w-4/5 rounded-xl bg-secondary-100" />
  </div>
);

const Stat = () => (
  <div>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="h-6 w-6"
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

// Loading: Card
// ---------------
export interface CardSkeletonProps {
  lines?: [number, number, number];
}

export const CardSkeleton = ({ lines = [3, 2, 2] }: CardSkeletonProps) => (
  <Card role="status" className="animate-pulse" elevation="light">
    <Content lines={lines[0]} />
    <Content lines={lines[1]} />
    <Content lines={lines[2]} />
  </Card>
);

// Loading: Stats
// ---------------
export const StatsSkeleton = () => (
  <Card role="status" className="animate-pulse" elevation="light">
    asd
  </Card>
);

export const CardStatSkeleton = () => (
  <Card role="status" className="animate-pulse">
    <div className="mb-4 flex h-48 items-center justify-center rounded bg-secondary-300">
      <svg
        className="h-12 w-12 text-secondary-200 dark:text-secondary-600"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        fill="currentColor"
        viewBox="0 0 640 512"
      >
        <path d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 .0006 486.1 .0006 456.1L0 456.1z" />
      </svg>
    </div>
    <div className="mb-4 h-2.5 w-48 rounded-full bg-secondary-200"></div>
    <div className="mb-2.5 h-2 rounded-full bg-secondary-200"></div>
    <div className="mb-2.5 h-2 rounded-full bg-secondary-200"></div>
    <div className="h-2 rounded-full bg-secondary-200"></div>
    <div className="mt-4 flex items-center space-x-3">
      <svg
        className="h-14 w-14 text-secondary-200 dark:text-secondary-700"
        aria-hidden="true"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
          clip-rule="evenodd"
        ></path>
      </svg>
      <div>
        <div className="mb-2 h-2.5 w-32 rounded-full bg-secondary-200"></div>
        <div className="h-2 w-48 rounded-full bg-secondary-200"></div>
      </div>
    </div>
    <span className="sr-only">Loading...</span>
  </Card>
);
