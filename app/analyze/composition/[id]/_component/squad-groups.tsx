'use client';

import { Accordion, Badge, CopyButton, Detail, Squad, Timeline } from '@/ui';

import { getPilotName } from '@/lib/get-value';
import { type SquadCompositionStats } from '@/lib/stats/details/composition';
import { formatDate } from '@/lib/utils/date.utils';
import { toPercentage } from '@/lib/utils/math.utils';
import { Copy } from '@/ui/icons';

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
          <Accordion.Trigger className="flex gap-4 text-lg">
            <div className="w-14">
              <Badge variant="light">{current.items.length}</Badge>
            </div>
            {id.split('.').map(getPilotName).join(', ')}
          </Accordion.Trigger>
          <Accordion.Content>
            <div className="flex flex-col gap-8 pt-6">
              <div className="flex flex-wrap gap-8 px-2">
                <Detail
                  variant="secondary"
                  label="Percentile"
                  value={toPercentage(current.percentile)}
                />
                <Detail
                  variant="secondary"
                  label="Deviation"
                  value={
                    current.deviation ? toPercentage(current.deviation) : '-'
                  }
                />
                <Detail
                  variant="secondary"
                  label="Winrate"
                  value={current.winrate ? toPercentage(current.winrate) : '-'}
                />
              </div>
              <Timeline>
                {current.items.map(({ date, player, xws }) => (
                  <Timeline.Item key={date + player}>
                    <Timeline.Header>
                      {formatDate(new Date(date))}
                      <Timeline.Caption>by {player}</Timeline.Caption>
                    </Timeline.Header>
                    <Timeline.Body className="flex flex-1 flex-col items-start justify-between gap-4 md:mt-[3px] md:gap-6 lg:flex-row">
                      <Squad variant="narrow" xws={xws} />
                      <CopyButton size="small" content={JSON.stringify(xws)}>
                        <Copy className="inline-block h-4 w-4" /> Copy XWS
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
