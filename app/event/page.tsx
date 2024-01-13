import { z } from 'zod';

import { pointsUpdateDate } from '@/lib/config';
import { createMetadata } from '@/lib/metadata';
import { getAllTournaments } from '@/lib/vendor/listfortress';

import { Card, Detail, Message, Title } from '@/ui';
import { Calendar } from '@/ui/icons';
import { formatDate, fromDate } from '@/lib/utils/date.utils';

// Metadata
// ---------------
export const metadata = createMetadata({
  title: 'Tournaments',
  description: 'View the latest X-Wing tournments results.',
  ogTitle: 'Tournaments',
});

// Data
// ---------------
const FROM_DATE = new Date(pointsUpdateDate); // Should be enough
const PAGE_SIZE = 25;

const getTournaments = async ({ page }: { page: number }) => {
  console.log(page, (page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const tournaments = await getAllTournaments({
    format: 'standard',
    from: FROM_DATE,
  });
  return tournaments.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
};

const schema = z.object({
  page: z.coerce.number().default(1),
});

// Props
// ---------------
interface PageProps {
  searchParams: {
    page?: string;
  };
}

// Page
// ---------------
const TournamentPage = async ({ searchParams }: PageProps) => {
  const params = schema.safeParse(searchParams);

  if (!params.success) {
    return (
      <div className="grid flex-1 place-items-center">
        <Message variant="error">
          <Message.Title>Whoopsie, something went wrong!</Message.Title>
          Looks like there is an error in the given query parameters.
        </Message>
      </div>
    );
  }

  // TODO: Error handling
  const tournaments = await getTournaments(params.data);

  return (
    <>
      <Title className="pb-6">Tournaments</Title>
      <div className="grid gap-4">
        {tournaments.map(t => (
          <Card key={t.id}>
            <Card.Body>
              <div className="flex items-center gap-1 text-sm text-secondary-400">
                <Calendar className="h-3 w-3" />
                {formatDate(fromDate(t.date))}
              </div>
              <div className="text-xl font-bold text-primary-700">{t.name}</div>

              <div>
                <div>{t.location}</div>
                <div>{t.country}</div>
              </div>
            </Card.Body>
          </Card>
        ))}
      </div>
    </>
  );
};

export default TournamentPage;
