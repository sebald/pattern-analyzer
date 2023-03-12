import { Card, List, ShipIcon } from '@/components';
import { getShipName } from '@/lib/get-value';
import { toPercentage } from './shared';

export interface ShipCompositionProps {
  value: Map<string, number>;
  total: number;
}

export const ShipComposition = ({ value, total }: ShipCompositionProps) => {
  let data = Array.from(value.entries()).sort(([, a], [, b]) => b - a);
  if (data.length > 10) {
    // Only take TOP 10 and remove squads that only appearing once
    data = data.slice(0, 10).filter(([, count]) => count > 1);
  }

  const unique = data.reduce((t, [, count]) => t - count, total);

  return (
    <Card>
      <Card.Title>TOP {data.length} Ship Composition</Card.Title>
      <Card.Body>
        {data.length === 0 ? (
          <div className="py-6 text-center italic text-secondary-400">
            No common ship compositions found.
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
                    {ships.split('|').map((ship, idx) => (
                      <ShipIcon
                        key={`${ship}-${idx}`}
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
        <div className="text-center text-sm font-semibold">
          Unique compositions: {unique} ({toPercentage(unique / total)})
        </div>
      </Card.Body>
    </Card>
  );
};
