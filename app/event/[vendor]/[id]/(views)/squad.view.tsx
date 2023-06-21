import { SquadData } from '@/lib/types';

import { FilterProvider } from './components/context';
import { Filter } from './components/filter';
import { Squads } from './components/squads';

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
