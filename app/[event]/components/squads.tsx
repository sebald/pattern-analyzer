'use client';

import { Card, Center, Message, Link, Squad, Tiles } from 'components';
import type { SquadsData, XWSSquad } from 'lib/types';

import { useFilter } from './filter-context';

const match = (
  search: string,
  { xws, raw, player }: { xws: XWSSquad | null; raw: string; player: string }
) => {
  const needle = search.toLocaleLowerCase().replace(/\s\'/g, '');

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

export interface SquadsProps {
  squads: SquadsData[];
}

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
    return (
      <div className="pt-4">
        <Center>
          <Message>
            <strong>Nothing found.</strong>
            <br />
            Looks like there is no squad or player matching your query.
          </Message>
        </Center>
      </div>
    );
  }

  return (
    <Tiles>
      {filtered.map(squad => (
        <Card key={squad.id}>
          <Card.Body>
            {squad.xws ? (
              <Squad xws={squad.xws} />
            ) : (
              <div className="whitespace-pre-wrap break-words text-sm text-secondary-500">
                {squad.raw}
              </div>
            )}
          </Card.Body>
          <Card.Footer>
            <div className="flex items-center justify-between gap-2 px-1 pt-1 text-xs text-secondary-300">
              <div>by {squad.player}</div>
              {squad.url && (
                <Link className="text-right" href={squad.url} target="_blank">
                  View in YASB
                </Link>
              )}
            </div>
          </Card.Footer>
        </Card>
      ))}
    </Tiles>
  );
};
