import type { ReactNode } from 'react';

import { cn } from '@/lib/utils/classname.utils';
import { Headline, Link, Text } from '@/ui';
import { ChevronDown } from '@/ui/icons';

const HeroCardIcon = ({ children }: { children?: ReactNode }) => (
  <div className="rounded-full bg-primary-200/90 p-4 text-primary-700 md:row-span-2">
    {children}
  </div>
);

const HeroCardTitle = ({ children }: { children?: ReactNode }) => (
  <Headline level="2" className="p-0 text-3xl text-primary-900">
    {children}
  </Headline>
);

const HeroCardBody = ({ children }: { children?: ReactNode }) => (
  <Text prose className="text-pretty text-primary-900/80">
    {children}
  </Text>
);

const HeroLink = ({
  children,
  href,
}: {
  children?: ReactNode;
  href: string;
}) => (
  <Link
    variant="cta"
    size="regular"
    className="flex items-center gap-1 md:col-span-2 md:place-self-end"
    href={href}
  >
    {children}
    <ChevronDown className="size-3 -rotate-90" strokeWidth="3" />
  </Link>
);

const HeroCard = ({
  className,
  children,
}: {
  className?: string;
  children?: ReactNode;
}) => (
  <div
    className={cn(
      'rounded-lg p-6',
      'bg-gradient-to-br from-primary-100 to-primary-200',
      'grid grid-cols-1 place-items-center items-start gap-3',
      'md:grid-cols-[min-content,1fr] md:place-items-start md:gap-x-6',
      className
    )}
  >
    {children}
  </div>
);

export const Hero = {
  Card: HeroCard,
  Body: HeroCardBody,
  Title: HeroCardTitle,
  Icon: HeroCardIcon,
  Link: HeroLink,
};
