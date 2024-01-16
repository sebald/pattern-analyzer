import type { ReactNode } from 'react';
import { Card, Headline, Text } from '@/ui';

const HeroCardIcon = ({ children }: { children?: ReactNode }) => (
  <div className="rounded-full border border-primary-300 bg-primary-200 p-4 text-primary-700 md:row-span-2">
    {children}
  </div>
);

const HeroCardTitle = ({ children }: { children?: ReactNode }) => (
  <Headline level="2" className="p-0">
    {children}
  </Headline>
);

const HeroCardBody = ({ children }: { children?: ReactNode }) => (
  <Text prose>{children}</Text>
);

const HeroCard = ({
  className,
  children,
}: {
  className?: string;
  children?: ReactNode;
}) => (
  <Card
    inset="relaxed"
    className="grid grid-cols-1 place-items-center items-start gap-2 md:grid-cols-[min-content,1fr] md:place-items-start md:gap-x-6"
  >
    {children}
  </Card>
);

export const Hero = {
  Card: HeroCard,
  Body: HeroCardBody,
  Title: HeroCardTitle,
  Icon: HeroCardIcon,
};
