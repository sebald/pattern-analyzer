'use client';

import { Accordion, Badge, CopyButton, Detail, Squad, Timeline } from '@/ui';

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
            <div className="flex gap-4 text-lg">
              <div className="w-14">
                <Badge variant="light">{current.items.length}</Badge>
              </div>
              {id.split('.').map(getPilotName).join(', ')}
            </div>
          </Accordion.Trigger>
          <Accordion.Content>
            <div className="flex flex-wrap justify-around gap-2 rounded bg-secondary-100/25 px-2 py-2 md:gap-4 md:px-4">
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
                label="Deviation:"
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
              <Timeline>
                {current.items.map(({ date, player, xws }) => (
                  <Timeline.Item key={date + player}>
                    <Timeline.Header>
                      {formatDate(new Date(date))}
                      <Timeline.Caption>by {player}</Timeline.Caption>
                    </Timeline.Header>
                    <Timeline.Body className="flex flex-col items-start gap-4">
                      <Squad xws={xws} variant="narrow" />
                      <CopyButton size="small" content={JSON.stringify(xws)}>
                        Copy XWS
                      </CopyButton>
                    </Timeline.Body>
                  </Timeline.Item>
                ))}
              </Timeline>
            </div>
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion>
  );
};
