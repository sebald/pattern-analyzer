import { SquadData } from '@/lib/types';

import { FilterProvider } from './context';
import { Filter } from './filter';
import { Squads } from './squads';

// Props
// ---------------
export interface SquadViewProps {
  squads: SquadData[];
}

// View
// ---------------
export const SquadsView = ({ squads }: SquadViewProps) => (
  <FilterProvider>
    <Filter />
    <Squads squads={squads} />
  </FilterProvider>
);
