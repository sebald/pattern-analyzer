import { useState } from 'react';
import { Card, FactionSelection, List, UpgradeSlotSelection } from 'components';
import type { XWSFaction, XWSUpgrades, XWSUpgradeSlots } from 'lib/types';

import { FooterHint } from './shared';
import { getUpgradeName } from 'lib/get-value';

export interface UpgradeSummaryProps {
  value: {
    [faction in XWSFaction | 'all']: Map<
      string,
      {
        slot: keyof XWSUpgrades;
        count: number;
      }
    >;
  };
}

export const UpgradeSummary = ({ value }: UpgradeSummaryProps) => {
  const [faction, setFaction] = useState<XWSFaction | 'all'>('all');
  const [slot, setSlot] = useState<XWSUpgradeSlots | 'all'>('all');

  const data = Array.from(value[faction].entries())
    .filter(([, info]) => (slot === 'all' ? true : info.slot === slot))
    .sort(([, a], [, b]) => b.count - a.count);

  return (
    <Card>
      <Card.Title>Upgrade Summary*</Card.Title>
      <Card.Body>
        <div className="flex justify-end gap-3 pb-4">
          <FactionSelection value={faction} onChange={setFaction} allowAll />
          <UpgradeSlotSelection value={slot} onChange={setSlot} allowAll />
        </div>
        <List>
          {data.map(([upgrade, info]) => (
            <List.Item
              key={upgrade}
              className="flex flex-row items-center justify-between px-1 text-xs font-medium"
            >
              <div className="flex flex-row items-center">
                {getUpgradeName(upgrade) || upgrade}
              </div>
              <div className="tabular-nums text-secondary-400">
                {info.count}
              </div>
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
