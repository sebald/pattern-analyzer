'use client';

import { Fragment, useState } from 'react';

import { type Ships, getPilotName } from '@/lib/get-value';
import type { SquadCompositionStats } from '@/lib/stats/details/composition';
import { toPercentage } from '@/lib/utils';
import { isStandardized, upgradesToList } from '@/lib/xws';

import { PilotImage, Detail, Card, Switch } from '@/ui';
import { Info } from '@/ui/icons';

// Props
// ---------------
export interface PilotDetailProps {
  className?: string;
  ships: Ships[];
  value: SquadCompositionStats['pilot'];
}

// Components
// ---------------
export const PilotDetails = ({ className, ships, value }: PilotDetailProps) => {
  const [grouped, setGrouped] = useState<boolean>(true);

  const data = Object.entries(value);

  if (grouped) {
    data.sort(([, a], [, b]) => ships.indexOf(a.ship) - ships.indexOf(b.ship));
  }

  return (
    <Card className={className} inset="list">
      <Card.Header>
        <Card.Title>Pilots</Card.Title>
        <Card.Actions className="px-4">
          <Switch
            size="small"
            label="Group by Chassis"
            checked={grouped}
            onCheckedChange={setGrouped}
          />
        </Card.Actions>
        <Card.Body variant="enumeration">
          {data.map(([pid, current]) => (
            <div
              key={pid}
              className="grid gap-x-4 gap-y-6 px-4 py-5 md:grid-cols-[150px,auto] md:grid-rows-[auto,auto,auto] lg:grid-cols-[200px,auto]"
            >
              <PilotImage
                className="row-span-full hidden rounded-md md:block"
                pilot={pid}
                type="art"
                width={250}
                height={250}
              />
              <div className="text-xl font-semibold leading-none lg:text-2xl lg:font-bold">
                {getPilotName(pid)}
              </div>
              <div className="flex flex-wrap gap-x-8 gap-y-0.5">
                <Detail
                  variant="secondary"
                  className="max-w-[150px]"
                  label="Percentile"
                  value={toPercentage(current.percentile)}
                />
                <Detail
                  variant="secondary"
                  className="max-w-[150px]"
                  label="Deviation"
                  value={toPercentage(current.deviation)}
                />
                <Detail
                  variant="secondary"
                  className="max-w-[150px]"
                  label="Winrate"
                  value={current.winrate ? toPercentage(current.winrate) : '-'}
                />
                <Detail
                  variant="secondary"
                  className="max-w-[150px]"
                  label="Frequency"
                  value={toPercentage(current.frequency)}
                />
              </div>
              <div>
                <div className="text-sm font-medium text-secondary-400">
                  Performance with Loadout
                </div>
                {isStandardized(pid) ? (
                  <div className="text-secondary-950 flex items-center gap-1 pt-2 text-sm italic">
                    <Info className="h-4 w-4" /> Standarized Pilot. No
                    variations.
                  </div>
                ) : (
                  <div className="grid grid-cols-[max-content,auto] gap-x-6 gap-y-3 pt-2">
                    {current.upgrades.map(({ id, list, count, percentile }) => (
                      <Fragment key={id}>
                        <div className="text-right text-sm leading-6 text-secondary-600">
                          {toPercentage(percentile)} ({count})
                        </div>
                        <div className="font-medium">
                          {upgradesToList(list)}
                        </div>
                      </Fragment>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </Card.Body>
      </Card.Header>
    </Card>
  );
};
