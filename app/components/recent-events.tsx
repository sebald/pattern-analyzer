'use client';

import useSWR from 'swr/immutable';

import { getJson } from '@/lib/utils/fetch.utils';
import type { ListfortressTournamentInfo } from '@/lib/types';
import {
  Card,
  CardSkeleton,
  Headline,
  HeadlineSkeleton,
  Link,
  List,
  Message,
  Skeleton,
} from '@/ui';

export const RecentEvents = () => {
  const {
    data: events,
    isLoading,
    error,
  } = useSWR<ListfortressTournamentInfo[]>('/api/listfortress', getJson);

  // Eh ... error handling is overrated
  if (error) {
    return null;
  }

  if (isLoading) {
    return (
      <Skeleton>
        <HeadlineSkeleton className="mb-6 h-5" />
        <CardSkeleton lines={[1, 1, 1]} />
      </Skeleton>
    );
  }

  return (
    <div className="w-full md:px-6">
      <Headline level="3" className="text-primary-800">
        Recent Events
      </Headline>
      {events && events.length ? (
        <Card>
          <List variant="wide">
            {events.map(({ id, name, date, country }) => (
              <List.Item key={id}>
                <Link
                  className="text-lg text-secondary-900"
                  href={`/event/listfortress/${id}`}
                >
                  <h3 className="font-medium">{name}</h3>
                  <div className="text-sm text-secondary-500">
                    {date}
                    {country ? `, ${country}` : ''}
                  </div>
                </Link>
              </List.Item>
            ))}
          </List>
        </Card>
      ) : (
        <Message variant="info">
          <Message.Title>No recent events founds 😭</Message.Title>
        </Message>
      )}
    </div>
  );
};
