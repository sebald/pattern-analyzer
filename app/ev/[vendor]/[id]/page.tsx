import { getSquadsData } from '@/lib/event';
import { Vendor } from '@/lib/types';

import { FilterProvider } from './(views)/components/context';
import { Filter } from './(views)/components/filter';
import { Squads } from './(views)/components/squads';

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

  if (vendor === 'longshanks') {
    return '...meh';
  }

  const squads = await getSquadsData({ vendor, id });
  return (
    <FilterProvider>
      <Filter />
      <Squads squads={squads} />
    </FilterProvider>
  );
};

export default Page;
