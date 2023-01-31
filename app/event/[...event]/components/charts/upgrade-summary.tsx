import { useState } from 'react';
import { Card, FactionSelection, List } from 'components';
import type { XWSFaction } from 'lib/types';

import { FooterHint } from './shared';
import { getUpgradeName } from 'lib/get-value';

export interface UpgradeSummaryProps {
  value: { [faction in XWSFaction | 'all']: Map<string, number> };
}

export const UpgradeSummary = ({ value }: UpgradeSummaryProps) => {
  const [faction, setFaction] = useState<XWSFaction | 'all'>('all');

  const data = Array.from(value[faction].entries()).sort(
    ([, a], [, b]) => b - a
  );

  return (
    <Card>
      <Card.Title>Upgrade Summary*</Card.Title>
      <Card.Body>
        <div className="flex justify-end pb-4">
          <FactionSelection value={faction} onChange={setFaction} allowAll />
        </div>
        <List>
          {data.map(([upgrade, count]) => (
            <List.Item
              key={upgrade}
              className="flex flex-row items-center justify-between px-1 text-xs font-medium"
            >
              <div className="flex flex-row items-center">
                {getUpgradeName(upgrade) || upgrade}
              </div>
              <div className="tabular-nums text-secondary-400">{count}</div>
            </List.Item>
          ))}
        </List>
      </Card.Body>
      <Card.Footer>
        <FooterHint />
      </Card.Footer>
    </Card>
  );
};
