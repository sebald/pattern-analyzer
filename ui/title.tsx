import { cn } from '@/lib/utils';
import { headline } from 'app/fonts';

export interface TitleProps {
  children: React.ReactNode;
  className?: string;
}

export const Title = ({ children, className }: TitleProps) => (
  <h1
    className={cn(
      headline.variable,
      'font-headline text-3xl font-extrabold uppercase text-primary-800 md:text-5xl md:tracking-wide lg:text-6xl',
      className
    )}
  >
    {children}
  </h1>
);
