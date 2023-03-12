import { Caption, Link, Title, Inline, Button } from '@/components';
import { Trophy, Computed, Export } from '@/components/icons';
import type { EventData } from '@/lib/types';

import { AboutParsingDialog } from './about-parsing-dialog';
import { ExportDialog } from './export-dialog';

export interface HeaderProps {
  event: EventData;
}

export const PageHeader = ({ event }: HeaderProps) => {
  const squadsWithXWS = event.squads.filter(item => Boolean(item.xws)).length;

  return (
    <header className="mb-4 border-b border-b-primary-100 pb-6 md:mt-3">
      <Title>{event.title || 'Unknown Event'}</Title>
      <Caption>
        <Inline className="gap-4">
          {event.urls.map(({ href, text }) => (
            <Link key={href} href={href} target="_blank">
              <Inline className="whitespace-nowrap">
                <Trophy className="h-3 w-3" /> {text}
              </Inline>
            </Link>
          ))}
          <Inline className="whitespace-nowrap">
            <Computed className="h-3 w-3" /> {squadsWithXWS}/
            {event.squads.length} Squads parsed <AboutParsingDialog />
          </Inline>
          <ExportDialog event={event}>
            <Button className="whitespace-nowrap" variant="link" size="inherit">
              <Export className="h-3 w-3" /> Export
            </Button>
          </ExportDialog>
        </Inline>
      </Caption>
    </header>
  );
};
