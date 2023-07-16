import { pointsUpdateDate } from '@/lib/config';
import { compositionDetails } from '@/lib/stats/details/composition';
import { fromDate } from '@/lib/utils/date.utils';
import { getAllTournaments, getSquads } from '@/lib/vendor/listfortress';
import { Message, Title } from '@/ui';
import { SquadList } from '@/ui/squad-list';
import { z } from 'zod';

// Config
// ---------------
export const dynamic = 'force-dynamic';

/**
 * Opt into background revalidation. (see: https://github.com/vercel/next.js/discussions/43085)
 */
//export const generateStaticParams = () => [];

// Helpers
// ---------------
// Note: only checks the format, can still produce invalid dates (like 2022-02-31)
const DATE_REGEX = /(\d{4})-(\d{2})-(\d{2})/;

const schema = z
  .object({
    from: z.string().regex(DATE_REGEX).optional(),
    to: z.string().regex(DATE_REGEX).optional(),
    'small-samples': z.union([z.literal('show'), z.literal('hide')]).optional(),
  })
  .transform(({ 'small-samples': smallSamples, ...props }) => ({
    ...props,
    smallSamples: smallSamples === 'show',
  }));

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
  searchParams: {
    from: string;
    to: string;
    'small-samples': 'show' | 'hide';
  };
}

// Page
// ---------------
const Page = async ({ params, searchParams }: PageParams) => {
  const query = schema.safeParse(searchParams);

  if (!query.success) {
    return (
      <div className="grid flex-1 place-items-center">
        <Message variant="error">
          <Message.Title>Whoopsie, something went wrong!</Message.Title>
          Looks like there is an error in the given query parameters.
        </Message>
      </div>
    );
  }

  const from =
    query.data && query.data.from
      ? fromDate(query.data.from)
      : fromDate(pointsUpdateDate);
  const to = query.data && query.data.to ? fromDate(query.data.to) : undefined;

  const stats = await getCompositionStats(params.id, from, to);

  return (
    <>
      <SquadList squads={stats.squads} />
    </>
  );
};

export default Page;
