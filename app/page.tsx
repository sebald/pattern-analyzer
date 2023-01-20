import { Card, List } from 'components';

import { montserrat } from './fonts';
import { EventForm } from './components/event-form';

const Home = () => {
  return (
    <div className="grid min-h-screen place-items-center">
      <div className="flex flex-col items-center gap-10">
        <h1
          className={`${montserrat.className} prose flex items-center text-2xl font-extrabold uppercase text-primary-900`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-10 w-10"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z"
            />
          </svg>
          Pattern Analyzer
        </h1>
        <EventForm />
        <div className="w-full">
          <h2 className="prose pb-2 font-bold text-primary-900">
            Recent Events
          </h2>
          <Card>
            <List>
              <List.Item>Event 1</List.Item>
              <List.Item>Event 2</List.Item>
              <List.Item>Event 3</List.Item>
            </List>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Home;
