import type { ReactNode } from 'react';
import { z } from 'zod';

import { pointsUpdateDate } from '@/lib/config';
import { getTournaments } from '@/lib/db/tournaments';
import { createMetadata } from '@/lib/metadata';

import { Card, Link, Message, Title } from '@/ui';
import { ArrowRight, Calendar, Map, User } from '@/ui/icons';
import { formatDate, fromDate } from '@/lib/utils/date.utils';

// Metadata
// ---------------
export const metadata = createMetadata({
  title: 'Tournaments',
  description: 'View the latest X-Wing tournments results.',
  ogTitle: 'Tournaments',
});

// Helpers
// ---------------
const FROM_DATE = new Date(pointsUpdateDate); // Should be enough

const getPage = async ({ page }: { page: number }) => {
  const tournaments = await getTournaments({ from: FROM_DATE, page });
  return tournaments;
};

const schema = z.object({
  page: z.coerce.number().default(1),
});

interface PropertyProps {
  label: ReactNode;
  value: ReactNode;
}

const Property = ({ label, value }: PropertyProps) => (
  <div className="col-span-full grid grid-cols-subgrid items-baseline text-sm leading-tight lg:text-base">
    <div className="text-right font-medium text-secondary-500">{label}</div>
    <div className="text-secondary-600">{value}</div>
  </div>
);

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
  const tournaments = await getPage(params.data);

  return (
    <>
      <Title className="pb-6">Tournaments</Title>
      <div className="flex flex-col gap-2">
        {tournaments.map(t => (
          <Card inset="headless" className="md:px-6 md:py-6" key={t.id}>
            <Card.Body>
              <div className="flex items-center gap-1 text-xs text-secondary-400">
                <Calendar className="size-3" />
                {formatDate(fromDate(t.date))}
              </div>
              <div className="grid gap-6 md:grid-cols-[1fr_250px] lg:grid-cols-[1fr_300px]">
                <div className="col-span-1">
                  <Link
                    className="text-2xl font-bold text-primary-700 lg:text-3xl lg:tracking-tight"
                    href={`/event/listfortress/${t.id}`}
                  >
                    {t.name}
                  </Link>
                </div>

                <div className="col-span-1 grid grid-cols-[max-content_1fr] grid-rows-[min-content_min-content] items-start gap-x-2 gap-y-1.5 md:gap-y-0.5">
                  <Property
                    label={<Map className="size-3" />}
                    value={
                      <div>
                        {t.location ? t.location : 'N/A'} ({t.country})
                      </div>
                    }
                  />
                  <Property
                    label={<User className="size-3" />}
                    value={<>{t.players} Players</>}
                  />
                </div>
              </div>
            </Card.Body>
          </Card>
        ))}
      </div>
    </>
  );
};

export default TournamentPage;
