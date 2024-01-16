'use client';

import type { Vendor } from '@/lib/types';
import { SubNavigation } from '@/ui/sub-navigation';

export interface NavigationProps {
  className?: string;
  vendor: Vendor;
  id: string;
}

export const Navigation = ({ className, vendor, id }: NavigationProps) => (
  <SubNavigation className={className}>
    <SubNavigation.Item href={`/tournament/${vendor}/${id}/rankings`}>
      Rankings
    </SubNavigation.Item>
    <SubNavigation.Item href={`/tournament/${vendor}/${id}`}>
      Squads
    </SubNavigation.Item>
    <SubNavigation.Item href={`/tournament/${vendor}/${id}/insights`}>
      Insights
    </SubNavigation.Item>
    <SubNavigation.Item href={`/tournament/${vendor}/${id}/export`}>
      Export
    </SubNavigation.Item>
  </SubNavigation>
);
