import { Card, Collapsible, Container, Headline, Link, List } from '@/ui';
import { getAllTournaments } from '@/lib/vendor/listfortress';

import { EventForm } from './_components/event-form';
import { daysAgo } from '@/lib/utils/date.utils';

// Config
// ---------------
/**
 * Segment Config (see: https://beta.nextjs.org/docs/api-reference/segment-config)
 */
export const revalidate = 10800; // 3 hours

// Data
// ---------------
const getRecentEvents = async () => {
  const events = await getAllTournaments({
    from: daysAgo(20),
    format: 'standard',
  });

  return events;
};

// Page
// ---------------
const Home = async () => {
  const events = await getRecentEvents();

  return (
    <Container className="flex flex-col items-center gap-32">
      <div className="pt-6 md:pt-10">
        <Headline level="3" className="text-center text-primary-800">
          Find an Event
        </Headline>
        <EventForm />
      </div>
      <div className="max-w-xl md:px-6">
        <Headline level="3" className="text-center text-primary-800">
          Recent Events
        </Headline>
        <Card className="h-fit">
          <Collapsible maxHeight={350}>
            <List variant="wide">
              {events.map(({ id, name, date, country }) => (
                <List.Item key={id}>
                  <Link
                    className="text-lg text-secondary-900"
                    href={`/event/listfortress/${id}`}
                  >
                    <h3 className="font-medium">{name}</h3>
                    <div className="text-sm text-secondary-400">
                      {date}
                      {country ? `, ${country}` : ''}
                    </div>
                  </Link>
                </List.Item>
              ))}
            </List>
          </Collapsible>
        </Card>
      </div>
    </Container>
  );
};

export default Home;
