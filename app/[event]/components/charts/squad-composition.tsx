import { Card, List, ShipIcon } from 'components';
import { getShipName } from 'lib/get-value';
import { FooterHint } from './shared';

export interface SquadCompositionProps {
  value: Map<string, number>;
}

export const SquadComposition = ({ value }: SquadCompositionProps) => {
  let data = Array.from(value.entries()).sort(([, a], [, b]) => b - a);
  if (data.length > 10) {
    // Only take TOP 10 and remove squads that only appearing once
    data = data.slice(0, 10).filter(([, count]) => count > 1);
  }

  return (
    <Card>
      <Card.Title>TOP {data.length} Squad Composition*</Card.Title>
      <Card.Body>
        {data.length === 0 ? (
          <div className="py-6 text-center italic text-secondary-400">
            No common squads found.
          </div>
        ) : (
          <List variant="compact">
            {data.map(([ships, count]) => {
              return (
                <List.Item
                  key={ships}
                  className="flex flex-row items-center justify-between px-1 text-xs font-medium"
                >
                  <div className="flex flex-row items-center gap-2">
                    {ships.split('|').map(ship => (
                      <ShipIcon
                        key={ship}
                        ship={ship}
                        className="text-2xl text-secondary-700"
                        title={getShipName(ship) || ''}
                      />
                    ))}
                  </div>
                  <div className="tabular-nums text-secondary-400">{count}</div>
                </List.Item>
              );
            })}
          </List>
        )}
      </Card.Body>
      <Card.Footer>
        <FooterHint more="Squads that only appear once are ignored." />
      </Card.Footer>
    </Card>
  );
};
