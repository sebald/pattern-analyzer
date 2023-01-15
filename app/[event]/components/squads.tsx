'use client';

import { Card, Center, Info, Link, Squad, Tiles } from 'components';
import type { XWSSquad } from 'lib/xws';
import { useFilter } from './filter-context';

const match = (search: string, { pilots }: XWSSquad) => {
  const needle = search.toLocaleLowerCase().replace(/\s/g, '');
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
          <Info>
            <strong>Nothing found.</strong>
            <br />
            Looks like there is no squad matching your query.
          </Info>
        </Center>
      </div>
    );
  }

  return (
    <Tiles>
      {filtered.map(item => (
        <Card key={item.id}>
          <Card.Body>
            <Squad xws={item.xws} />
          </Card.Body>
          <Card.Footer>
            <Link
              className="text-xs text-secondary-300"
              href={item.url}
              target="_blank"
            >
              View in YASB
            </Link>
          </Card.Footer>
        </Card>
      ))}
    </Tiles>
  );
};
