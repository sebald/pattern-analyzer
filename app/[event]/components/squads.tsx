'use client';

import { Card, Center, Message, Link, Squad, Tiles } from 'components';
import type { XWSSquad } from 'lib/xws';
import { useFilter } from './filter-context';

const match = (search: string, { pilots }: XWSSquad) => {
  const needle = search.toLocaleLowerCase().replace(/\s\'/g, '');
  const result = pilots.find(pilot => {
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
  squads: {
    id: string;
    url: string;
    xws: XWSSquad;
    raw: string;
    player: string;
  }[];
}

export const Squads = ({ squads }: SquadsProps) => {
  const { faction, query } = useFilter();
  const filtered = squads.filter(({ xws }) => {
    const hasFaction = faction === 'all' ? true : xws.faction === faction;
    // Only filter if query has least two letters
    const hasMatch = query.length < 2 ? true : match(query, xws);

    return hasFaction && hasMatch;
  });

  if (filtered.length === 0) {
    return (
      <div className="pt-4">
        <Center>
          <Message>
            <strong>Nothing found.</strong>
            <br />
            Looks like there is no squad matching your query.
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
            <Squad xws={squad.xws} />
          </Card.Body>
          <Card.Footer>
            <div className="flex items-center justify-between gap-2 px-1 pt-1 text-xs text-secondary-300">
              <div>by {squad.player}</div>
              <Link className="text-right" href={squad.url} target="_blank">
                View in YASB
              </Link>
            </div>
          </Card.Footer>
        </Card>
      ))}
    </Tiles>
  );
};
