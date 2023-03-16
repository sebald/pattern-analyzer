import type { EventData } from '@/lib/types';
import { Headline, Message } from '@/components';

export interface ExportProps {
  event: EventData;
}

export const Export = ({ event }: ExportProps) => (
  <div>
    <Headline level="2">Listfortress Export</Headline>
    {event.id.length > 1 ? (
      <Message variant="warning" size="large">
        <Message.Title>Where is the Listfortress Export!?</Message.Title>
        Export for Listfortress is not availble if displaying multiple events.
      </Message>
    ) : event.vendor === 'longshanks' ? (
      <span>export longshanks</span>
    ) : (
      <span>export rollbetter</span>
    )}
  </div>
);
