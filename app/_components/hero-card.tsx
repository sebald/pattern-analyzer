import type { ReactNode } from 'react';

import { Card } from '@/ui/card';

// Card.Title
// ---------------
export interface HeroCardTitleProps {
  children: ReactNode;
}

const CardTitle = ({ children }: HeroCardTitleProps) => <h2>{children}</h2>;

// Props
// ---------------
export interface HeroCardProps {
  title?: ReactNode;
  children?: ReactNode;
}

// Component
// ---------------
export const HeroCard = ({ title, children }: HeroCardProps) => (
  <Card inset="headless">
    <h2>{}</h2>
    <div>
      explore detailed pilot statistics that go beyond the surface, offering a
      deep dive into the performance metrics that matter. From win rates to
      game-changing moments, we have got you covered with the most comprehensive
      pilot data available.
    </div>
  </Card>
);
