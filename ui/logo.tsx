import { SVGProps } from 'react';
import { cn } from '@/lib/utils';

export interface LogoProps extends SVGProps<SVGSVGElement> {
  className?: string;
}

export const Logo = ({ className, ...props }: LogoProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className={cn('h-6 w-6 text-primary-900 transition-all', className)}
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z"
    />
  </svg>
);
