import type { SquadData } from '@/lib/types';

import { Card } from './card';
import { CopyButton } from './copy-button';
import { Archive } from './icons';
import { Link } from './link';
import { Squad } from './squad';
import { Tiles } from './tiles';

// Helpers
// ---------------
const getVendorName = (link: string) => {
  if (link.includes('yasb.app')) {
    return 'YASB';
  }
  if (link.includes('launchbaynext')) {
    return 'LBN';
  }
  return 'Builder';
};

const NoSquadInfo = () => (
  <div className="grid h-full place-items-center">
    <div className="flex flex-col items-center gap-1 py-9">
      <Archive className="h-8 w-8 text-secondary-100" />
      <div className="text-xs text-secondary-200">No list submitted.</div>
    </div>
  </div>
);

// Props
// ---------------
export interface SquadListProps {
  squads: SquadData[];
}

// Component
// ---------------
export const SquadList = ({ squads }: SquadListProps) => {
  return (
    <Tiles>
      {squads.map(squad => (
        <Card key={squad.id}>
          <Card.Body>
            {squad.xws ? (
              <Squad xws={squad.xws} />
            ) : squad.raw ? (
              <div className="whitespace-pre-wrap break-words text-sm text-secondary-500">
                {squad.raw}
              </div>
            ) : (
              <NoSquadInfo />
            )}
          </Card.Body>
          <Card.Footer>
            <div className="flex items-center justify-between gap-2 pt-1 text-xs text-secondary-300">
              <div>
                #{squad.rank.elimination || squad.rank.swiss}: {squad.player}
              </div>
              {squad.url ? (
                <Link className="text-right" href={squad.url} target="_blank">
                  View in {getVendorName(squad.url)}
                </Link>
              ) : squad.xws ? (
                <CopyButton
                  variant="link"
                  size="inherit"
                  content={JSON.stringify(squad.xws)}
                >
                  Copy XWS
                </CopyButton>
              ) : null}
            </div>
          </Card.Footer>
        </Card>
      ))}
    </Tiles>
  );
};
