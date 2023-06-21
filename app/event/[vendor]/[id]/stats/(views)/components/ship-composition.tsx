import { Card, List, ShipIcon } from '@/ui';
import { getShipName } from '@/lib/get-value';
import { toPercentage } from '@/lib/utils';

export interface ShipCompositionProps {
  value: Map<string, number>;
  total: number;
}

export const ShipComposition = ({ value, total }: ShipCompositionProps) => {
  const data = Array.from(value.entries())
    .filter(([, count]) => count > 1)
    .sort(([, a], [, b]) => b - a);
  const unique = data.reduce((t, [, count]) => t - count, total);

  return (
    <Card>
      <Card.Title>Repeating Ship Composition</Card.Title>
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
