import type { ReactNode } from 'react';
import { z } from 'zod';

import { pointsUpdateDate } from '@/lib/config';
import { getTournaments } from '@/lib/db/tournaments';
import { createMetadata } from '@/lib/metadata';

import { Card, Link, Message, Table } from '@/ui';
import { View } from '@/ui/icons';
import { formatDate, fromDate } from '@/lib/utils/date.utils';
import Image from 'next/image';

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
  const tournaments = await getPage({ page });

  return (
    <>
      <Card inset="none">
        <Card.Body variant="enumeration">
          <Table
            columns={[
              { children: 'Name', width: '1fr' },
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
                    href={`/event/listfortress/${t.id}`}
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

      <div className="flex items-center justify-between">
        {page > 1 ? (
          <Link href={`/event/?page=${page - 1}`}>Prev</Link>
        ) : (
          <div />
        )}
        <div>Page {page}</div>
        <Link href={`/event/?page=${page + 1}`}>Next</Link>
      </div>
    </>
  );
};

export default TournamentPage;
