import { Card, List } from 'components';
import { EventForm } from './components/event-form';

const Home = () => {
  return (
    <div className="grid min-h-screen place-items-center">
      <div className="flex flex-col items-center gap-7">
        <h1 className="prose text-5xl font-black text-primary-700">
          Pattern Analyzer
        </h1>
        <EventForm />
        <Card>
          <List>
            <List.Item>Event 1</List.Item>
            <List.Item>Event 2</List.Item>
            <List.Item>Event 3</List.Item>
          </List>
        </Card>
      </div>
    </div>
  );
};

export default Home;
