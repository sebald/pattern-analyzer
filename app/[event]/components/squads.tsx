'use client';

import { Card, Link, Squad, Tiles } from 'components';
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
  const { faction, search } = useFilter();
  return (
    <Tiles>
      {squads
        .filter(({ xws }) => {
          const hasFaction = faction === 'all' ? true : xws.faction === faction;
          const hasMatch = search.length === 0 ? true : match(search, xws);

          return hasFaction && hasMatch;
        })
        .map(item => (
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
