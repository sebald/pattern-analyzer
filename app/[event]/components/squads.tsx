'use client';

import { Card, Link, Squad, Tiles } from 'components';
import type { XWSSquad } from 'lib/xws';
import { useFilter } from './filter-context';

export interface SquadsProps {
  squads: {
    id: string;
    url: string;
    xws: XWSSquad;
  }[];
}

export const Squads = ({ squads }: SquadsProps) => {
  const { faction } = useFilter();
  return (
    <Tiles>
      {squads
        .filter(({ xws }) => {
          if (faction === 'all') {
            return true;
          }
          return xws.faction === faction;
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
