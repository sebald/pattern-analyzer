import { pointsUpdateDate } from '@/lib/config';
import { compositionDetails } from '@/lib/stats/details/composition';
import { fromDate } from '@/lib/utils/date.utils';
import { getAllTournaments, getSquads } from '@/lib/vendor/listfortress';
import { Message, Title } from '@/ui';
import { SquadList } from '@/ui/squad-list';
import { z } from 'zod';

/**
 * Opt into background revalidation. (see: https://github.com/vercel/next.js/discussions/43085)
 */
export const generateStaticParams = () => [];

// Data
// ---------------
const getCompositionStats = async (
  id: string,
  from: Date,
  to: Date | undefined
) => {
  const tournaments = await getAllTournaments({
    from,
    to,
    format: 'standard',
  });

  const squads = await Promise.all(
    tournaments.map(({ id }) => getSquads({ id: `${id}` }))
  );

  return compositionDetails(id, squads);
};

// Props
// ---------------
interface PageParams {
  params: {
    id: string;
  };
}

// Page
// ---------------
const Page = async ({ params }: PageParams) => {
  const stats = await getCompositionStats(
    params.id,
    fromDate(pointsUpdateDate),
    undefined
  );

  return (
    <>
      <SquadList squads={stats.squads} />
    </>
  );
};

export default Page;
