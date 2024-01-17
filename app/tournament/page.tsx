import Image from 'next/image';
import { z } from 'zod';

import { pointsUpdateDate } from '@/lib/config';
import { getTournaments } from '@/lib/db/tournaments';
import { createMetadata } from '@/lib/metadata';
import { cn } from '@/lib/utils/classname.utils';
import { ago, formatDate, fromDate } from '@/lib/utils/date.utils';

import { Caption, Card, Inline, Link, Message, Table, Title } from '@/ui';
import { ChevronDown, Info, View } from '@/ui/icons';
import { getLastSync } from '@/lib/db/system';

// Metadata
// ---------------
export const metadata = createMetadata({
  title: 'Tournaments',
  description: 'View the latest X-Wing tournments results.',
  ogTitle: 'Tournaments',
  ogWidth: 65,
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
  const { page } = params.data;
  const [tournaments, lastSync] = await Promise.all([
    getPage({ page }),
    getLastSync(),
  ]);

  return (
    <>
      <div className="pb-6">
        <Title>Tournaments</Title>
        <Caption>
          <Inline className="whitespace-nowrap">
            <Info className="size-3" /> Last sync {ago(lastSync)} ago
            (listfortress.com)
          </Inline>
        </Caption>
      </div>

      <div className="flex flex-col gap-6">
        <Card inset="none">
          <Card.Body variant="enumeration">
            <Table
              columns={[
                { children: 'Name', width: 'minmax(250px, 1fr)' },
                { children: 'Date', width: 'max-content' },
                { children: 'Players', width: 'max-content' },
                { children: 'Location', width: '1fr' },
                { children: 'Country', width: 'max-content' },
                { children: 'View', width: 'max-content' },
              ]}
            >
              {tournaments.map(t => (
                <Table.Row key={t.id}>
                  <Table.Cell className="!text-base !font-bold">
                    {t.name}
                  </Table.Cell>
                  <Table.Cell>{formatDate(fromDate(t.date))}</Table.Cell>
                  <Table.Cell>{t.players}</Table.Cell>
                  <Table.Cell>{t.location || 'N/A'}</Table.Cell>
                  <Table.Cell>
                    <Image
                      src={`https://flagicons.lipis.dev/flags/4x3/${
                        t.country?.toLocaleLowerCase() || 'xx'
                      }.svg`}
                      alt={t.location || '?'}
                      height={16}
                      width={16}
                    />
                  </Table.Cell>
                  <Table.Cell>
                    <Link
                      href={`/tournament/listfortress/${t.id}`}
                      variant="highlight"
                      className="text-primary-800"
                    >
                      <View className="h-5 w-5" />
                    </Link>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table>
          </Card.Body>
        </Card>

        <div className="flex items-center justify-center">
          <Link
            variant="cta"
            size="regular"
            className={cn('flex items-center gap-1', page <= 1 && 'opacity-0')}
            href={`/tournament/?page=${page - 1}`}
          >
            <ChevronDown className="size-3 rotate-90" strokeWidth="2.5" /> Prev
          </Link>
          <div className="px-10 text-lg font-bold text-secondary-500">
            Page {page}
          </div>
          <Link
            variant="cta"
            size="regular"
            className="flex items-center gap-1"
            href={`/tournament/?page=${page + 1}`}
          >
            Next <ChevronDown className="size-3 -rotate-90" strokeWidth="2.5" />
          </Link>
        </div>
      </div>
    </>
  );
};

export default TournamentPage;
