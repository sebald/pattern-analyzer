import { Fragment } from 'react';

import { getPilotName } from '@/lib/get-value';
import type { SquadCompositionStats } from '@/lib/stats/details/composition';
import { toPercentage } from '@/lib/utils';
import { isStandardized, upgradesToList } from '@/lib/xws';

import { PilotImage, Detail, Badge } from '@/ui';
import { Info } from '@/ui/icons';

// Props
// ---------------
export interface PilotDetailProps {
  value: SquadCompositionStats['pilot'];
}

// Components
// ---------------
export const PilotDetails = ({ value }: PilotDetailProps) =>
  Object.entries(value).map(([pid, current]) => (
    <div
      key={pid}
      className="grid gap-x-4 gap-y-5 px-4 py-5 md:grid-cols-[150px,auto] md:grid-rows-[auto,auto,auto] lg:grid-cols-[200px,auto] lg:gap-y-3"
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
          size="small"
          align="left"
          className="max-w-[150px]"
          label="Percentile:"
          value={toPercentage(current.percentile)}
        />
        <Detail
          variant="secondary"
          size="small"
          align="left"
          className="max-w-[150px]"
          label="Deviation:"
          value={toPercentage(current.deviation)}
        />
        <Detail
          variant="secondary"
          size="small"
          align="left"
          className="max-w-[150px]"
          label="Winrate:"
          value={current.winrate ? toPercentage(current.winrate) : '-'}
        />
        <Detail
          variant="secondary"
          size="small"
          align="left"
          className="max-w-[150px]"
          label="Frequency:"
          value={toPercentage(current.frequency)}
        />
      </div>
      <div className="pt-4">
        <div className="text-sm font-medium uppercase text-secondary-500">
          Performance with Loadout
        </div>
        {isStandardized(pid) ? (
          <div className="text-secondary-950 flex items-center gap-1 pt-2 text-sm italic">
            <Info className="h-4 w-4" /> Standarized Pilot. No variations in
            loadout possible.
          </div>
        ) : (
          <div className="grid max-w-3xl grid-cols-[max-content,auto,max-content] gap-4 pt-4 lg:pt-2">
            {current.upgrades.map(({ id, list, count, percentile }) => (
              <Fragment key={id}>
                <div className="leading-6">
                  <Badge
                    className="tabular-nums"
                    variant="neutral"
                    size="small"
                  >
                    {count}
                  </Badge>
                </div>
                <div className="font-medium">{upgradesToList(list)}</div>
                <div className="pl-4 text-sm leading-6">
                  {toPercentage(percentile)}
                </div>
              </Fragment>
            ))}
          </div>
        )}
      </div>
    </div>
  ));
