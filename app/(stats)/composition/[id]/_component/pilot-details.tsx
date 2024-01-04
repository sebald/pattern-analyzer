'use client';

import { Fragment, useState } from 'react';

import { type Ships, getPilotName, getShipName } from '@/lib/get-value';
import type { SquadCompositionStats } from '@/lib/stats/details/composition';
import { toPercentage } from '@/lib/utils';
import { isStandardized, upgradesToList } from '@/lib/xws';

import { PilotImage, Detail, Card, Headline, ShipIcon } from '@/ui';
import { Info } from '@/ui/icons';

// Props
// ---------------
export interface PilotDetailProps {
  className?: string;
  baseline: { ships: Ships[]; percentile: number };
  value: SquadCompositionStats['pilot'];
}

// Components
// ---------------
export const PilotDetails = ({
  className,
  baseline,
  value,
}: PilotDetailProps) => {
  const data = Object.entries(value).reduce(
    (acc, [pid, current]) => {
      const key = current.ship;
      acc[key] = (acc[key] || []).concat([[pid, current]]);
      return acc;
    },
    {} as { [ship: string]: [string, SquadCompositionStats['pilot'][string]][] }
  );

  Object.keys(data).forEach(key => {
    data[key].sort(([, a], [, b]) => {
      const result =
        baseline.ships.indexOf(a.ship) - baseline.ships.indexOf(b.ship);
      return result !== 0 ? result : b.percentile - a.percentile;
    });
  });

  return (
    <div className={className}>
      <Headline level="2" variant="section">
        Pilots
      </Headline>
      <div className="flex flex-col gap-14">
        {Object.entries(data).map(([ship, pilots]) => (
          <div key={ship} className="flex flex-col gap-2">
            <Headline level="4" variant="subsection">
              <div className="flex items-center gap-2">
                <ShipIcon ship={ship} className="text-xl" />
                <span className="whitespace-nowrap text-lg">
                  {getShipName(ship)}
                </span>
              </div>
            </Headline>
            <Card inset="list" size="fit">
              <Card.Body variant="enumeration">
                {pilots.map(([pid, current]) => (
                  <div key={pid} className="flex gap-4 px-4 py-5">
                    <div>
                      <PilotImage
                        className="hidden w-52 rounded-md md:block"
                        pilot={pid}
                        type="art"
                        width={208}
                        height={208}
                      />
                    </div>
                    <div className="flex flex-col gap-6">
                      <div className="flex flex-col gap-4">
                        <div className="text-2xl font-bold leading-none">
                          {getPilotName(pid)}
                        </div>
                        <div className="flex flex-wrap gap-x-8 gap-y-4">
                          <Detail
                            label="Percentile"
                            value={toPercentage(current.percentile)}
                          />
                          <Detail
                            label="Std. Deviation"
                            value={
                              current.deviation
                                ? toPercentage(current.deviation)
                                : '-'
                            }
                          />
                          <Detail
                            label="Winrate"
                            value={
                              current.winrate
                                ? toPercentage(current.winrate)
                                : '-'
                            }
                          />
                          <Detail
                            label="Frequency"
                            value={toPercentage(current.frequency)}
                          />
                          <Detail
                            label="vs. Composition"
                            value={toPercentage(
                              current.percentile - baseline.percentile,
                              {
                                sign: true,
                              }
                            )}
                            highlight={current.percentile - baseline.percentile}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-secondary-400">
                          Loadout Performance
                        </div>
                        {isStandardized(pid) ? (
                          <div className="text-secondary-950 flex items-center gap-1 pt-2 text-sm italic">
                            <Info className="h-4 w-4" /> Standarized Pilot. No
                            loadout variations.
                          </div>
                        ) : (
                          <div className="grid grid-cols-[max-content,auto] gap-x-6 gap-y-3 pt-2">
                            {current.upgrades.map(
                              ({ id, list, count, percentile }) => (
                                <Fragment key={id}>
                                  <div className="text-right text-sm leading-6 text-secondary-600">
                                    {toPercentage(percentile)} ({count})
                                  </div>
                                  <div className="font-medium">
                                    {upgradesToList(list)}
                                  </div>
                                </Fragment>
                              )
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};
