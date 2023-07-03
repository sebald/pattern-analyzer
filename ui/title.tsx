import { cn } from '@/lib/utils';
import { montserrat } from 'app/fonts';

export interface TitleProps {
  children: React.ReactNode;
  className?: string;
}

export const Title = ({ children, className }: TitleProps) => (
  <h1
    className={cn(
      montserrat.variable,
      'font-headline text-3xl font-extrabold uppercase text-primary-800 md:text-5xl md:tracking-wide',
      className
    )}
  >
    {children}
  </h1>
);
