import { getSquadsData } from '@/lib/event';
import { Vendor } from '@/lib/types';

import { FilterProvider } from './components/context';
import { Filter } from './components/filter';
import { Squads } from './components/squads';

// Props
// ---------------
interface PageParams {
  params: {
    vendor: Vendor;
    id: string;
  };
}

// Page
// ---------------
const Page = async ({ params }: PageParams) => {
  const { vendor, id } = params;
  const squads = await getSquadsData({ vendor, id });

  if (vendor === 'longshanks') {
    return '...meh';
  }

  return (
    <FilterProvider>
      <Filter />
      <Squads squads={squads} />
    </FilterProvider>
  );
};

export default Page;
