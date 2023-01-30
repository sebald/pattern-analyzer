import { getEventInfoByVendor } from 'lib/get-event';
import { Card, Container, Link, Logo } from 'components';
import { List } from 'components/list';

import { montserrat } from './fonts';
import { RECENT_EVENTS } from './preload';
import { EventForm } from './components/event-form';

/**
 * Segment Config (see: https://beta.nextjs.org/docs/api-reference/segment-config)
 */
export const revalidate = 3600; // 1 day
export const fetchCache = 'force-cache';

// Page
// ---------------
const Home = async () => {
  const data = await Promise.all([
    ...RECENT_EVENTS.longshanks.map(ids =>
      getEventInfoByVendor({ vendor: 'longshanks', ids })
    ),
    ...RECENT_EVENTS.rollbetter.map(ids =>
      getEventInfoByVendor({ vendor: 'rollbetter', ids })
    ),
  ]);

  return (
    <Container className="grid flex-1 place-items-center">
      <div>
        <div className="pt-8 pb-20 md:pb-14">
          <Logo />
        </div>
        <div className="flex-1">
          <EventForm />
        </div>
        {data.length > 0 && (
          <div className="w-full pt-24 md:px-6">
            <h2
              className={`${montserrat.className} prose pb-2 font-bold uppercase text-primary-400`}
            >
              Recent Events
            </h2>
            <Card>
              <List>
                {data.map(({ id, vendor, title, date }) => (
                  <List.Item key={id}>
                    <Link
                      className="text-lg text-secondary-900"
                      href={`/event/${vendor}/${id}`}
                    >
                      <h3 className="font-medium">{title}</h3>
                      <div className="text-sm text-secondary-500">{date}</div>
                    </Link>
                  </List.Item>
                ))}
              </List>
            </Card>
          </div>
        )}
      </div>
    </Container>
  );
};

export default Home;
