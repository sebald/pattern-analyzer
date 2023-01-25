import { Card, List, ShipIcon } from 'components';
import { getShipName } from 'lib/get-value';
import { FooterHint } from './shared';

export interface SquadCompositionProps {
  value: Map<string, number>;
}

export const SquadComposition = ({ value }: SquadCompositionProps) => {
  // Only take TOP 10
  let data = Array.from(value.entries()).sort(([, a], [, b]) => b - a);
  if (data.length > 10) {
    data = data.slice(0, 10);
  }

  console.log(data);

  return (
    <Card>
      <Card.Title>TOP {data.length} Squad Composition*</Card.Title>
      <Card.Body>
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
      </Card.Body>
      <Card.Footer>
        <FooterHint />
      </Card.Footer>
    </Card>
  );
};
