'use client';

import { Accordion, Badge, CopyButton, Detail, Squad } from '@/ui';

import { getPilotName } from '@/lib/get-value';
import { type SquadCompositionStats } from '@/lib/stats/details/composition';
import { formatDate } from '@/lib/utils/date.utils';
import { toPercentage } from '@/lib/utils/math.utils';

// Props
// ---------------
export interface SquadGroupsProps {
  value: SquadCompositionStats['squads'];
}

// Component
// ---------------
export const SquadGroups = ({ value }: SquadGroupsProps) => {
  const data = Object.entries(value);
  data.sort(([, a], [, b]) => b.percentile - a.percentile);

  return (
    <Accordion type="multiple">
      {Object.entries(value).map(([id, current]) => (
        <Accordion.Item value={id} key={id}>
          <Accordion.Trigger>
            <div className="flex gap-2">
              <div className="w-9 text-right">
                <Badge variant="light">{current.items.length}</Badge>
              </div>
              {id.split('.').map(getPilotName).join(', ')}
            </div>
          </Accordion.Trigger>
          <Accordion.Content>
            <div className="flex justify-around gap-4 rounded bg-secondary-100/25 px-4 py-2">
              <Detail
                variant="secondary"
                size="small"
                align="left"
                label="Percentile:"
                value={toPercentage(current.percentile)}
              />
              <Detail
                variant="secondary"
                size="small"
                align="left"
                label="Deviant:"
                value={toPercentage(current.deviation)}
              />
              <Detail
                variant="secondary"
                size="small"
                align="left"
                label="Winrate:"
                value={current.winrate ? toPercentage(current.winrate) : '-'}
              />
            </div>
            <div className="flex flex-col gap-4 pt-4">
              {current.items.map(({ date, player, xws }) => (
                <div
                  key={date + player}
                  className="gap grid grid-cols-2 gap-y-6 rounded-lg border border-secondary-200 px-4 py-6"
                >
                  <div>
                    <div className="text-sm font-medium leading-none">
                      {formatDate(new Date(date))}
                    </div>
                    <div className="text-xs text-secondary-400">
                      by {player}
                    </div>
                  </div>
                  <div className="col-start-2 flex flex-col items-end">
                    <CopyButton size="small" content={JSON.stringify(xws)}>
                      Copy XWS
                    </CopyButton>
                  </div>

                  <div className="col-span-full">
                    <Squad xws={xws} variant="narrow" />
                  </div>
                </div>
              ))}
            </div>
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion>
  );
};
