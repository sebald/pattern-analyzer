'use client';

import { Card, Center, Message, Link, Squad, Tiles, CopyButton } from '@/ui';
import { Archive } from '@/ui/icons';
import type { SquadData, XWSSquad } from '@/lib/types';

import { useFilter } from './context';

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

const match = (
  search: string,
  { xws, raw, player }: { xws: XWSSquad | null; raw: string; player: string }
) => {
  const needle = search.toLocaleLowerCase().replace(/[\s']/g, '');

  // Search matches player name
  if (player.toLocaleLowerCase().includes(needle)) {
    return true;
  }

  // No XWS, use raw value :-/
  if (!xws) {
    return raw.toLocaleLowerCase().includes(needle);
  }

  const result = xws.pilots.find(pilot => {
    // Search matches pilot name
    if (pilot.id.includes(needle)) {
      return true;
    }

    // Check upgrades if they match
    return (Object.values(pilot.upgrades) as string[][])
      .flat()
      .find(upgrade => upgrade.includes(needle));
  });

  return Boolean(result);
};

// Helper Components
// ---------------
const NoSquadInfo = () => (
  <div className="grid h-full place-items-center">
    <div className="flex flex-col items-center gap-1 py-9">
      <Archive className="h-8 w-8 text-secondary-100" />
      <div className="text-xs text-secondary-200">No list submitted.</div>
    </div>
  </div>
);

const EmptySearch = () => (
  <div className="pt-4">
    <Center>
      <Message>
        <Message.Title>Nothing found.</Message.Title>
        Looks like there is nothing matching your query.
      </Message>
    </Center>
  </div>
);

// Props
// ---------------
export interface SquadsProps {
  squads: SquadData[];
}

// Component
// ---------------
export const Squads = ({ squads }: SquadsProps) => {
  const { faction, query } = useFilter();
  const filtered = squads.filter(({ xws, player, raw }) => {
    const hasFaction = faction === 'all' ? true : xws?.faction === faction;

    // Only filter if query has least two letters
    const hasMatch =
      query.length < 2 ? true : match(query, { xws, player, raw });

    return hasFaction && hasMatch;
  });

  if (filtered.length === 0) {
    return <EmptySearch />;
  }

  return (
    <Tiles>
      {filtered.map(squad => (
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
