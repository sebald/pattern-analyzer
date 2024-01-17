import type { CSSProperties } from 'react';

import { getFactionName } from '@/lib/get-value';
import { SquadData } from '@/lib/types';
import { cn } from '@/lib/utils/classname.utils';
import { round } from '@/lib/utils/math.utils';

import { Card, Detail, FactionIcon, ShipList } from '@/ui';

// Props
// ---------------
export interface RankingsProps {
  squads: SquadData[];
}

// View
// ---------------
export const Rankings = ({ squads }: RankingsProps) => (
  <div className="grid grid-cols-[max-content,max-content,1fr,1fr,1fr] gap-x-3 gap-y-3 md:grid-cols-[max-content,1fr,1fr,1fr,1fr,max-content] md:gap-x-6 lg:grid-cols-[max-content,max-content,1fr,1fr,1fr,max-content]">
    {squads.map(current => {
      const rank = current.rank.elimination || current.rank.swiss;

      return (
        <Card
          key={current.player}
          inset="headless"
          subgrid
          className="items-center gap-y-6 pr-4"
        >
          <div className="flex items-center justify-center pr-2 md:pr-0">
            <div>
              <div
                className={cn(
                  'text-center text-lg font-bold md:text-2xl',
                  rank === 1 && 'text-amber-500',
                  rank === 2 && 'text-zinc-400',
                  rank === 3 && 'text-yellow-700'
                )}
              >
                {rank}
              </div>
              {current.rank.elimination ? (
                <div className="text-xs text-secondary-400">
                  (swiss {current.rank.swiss})
                </div>
              ) : null}
            </div>
          </div>
          <div className="col-span-4 flex flex-col gap-1 md:col-span-1 lg:pl-2">
            <div className="break-words text-xl font-bold md:text-2xl">
              {current.player}
            </div>
            <div className="flex items-center gap-1 text-xs text-secondary-400">
              {current.xws?.faction ? (
                <>
                  <FactionIcon
                    faction={current.xws.faction}
                    className="size-4"
                  />{' '}
                  {getFactionName(current.xws.faction)}
                </>
              ) : (
                'N/A'
              )}
            </div>
          </div>
          <Detail
            label="List"
            value={<ShipList xws={current.xws} size="large" />}
            className={{ container: 'col-start-2 md:col-start-auto' }}
          />
          <Detail
            label="Points"
            value={current.points}
            className={{ container: 'col-start-3 md:col-start-auto' }}
          />
          <Detail
            label="W/D/L"
            value={
              <>
                <span>{current.record.wins}</span>/
                <span>{current.record.ties}</span>/
                <span>{current.record.losses}</span>
              </>
            }
            className={{ container: 'col-start-4 md:col-start-auto' }}
          />
          <Detail
            label="SOS"
            value={round(current.sos, 2)}
            className={{ container: 'col-start-6 md:col-start-auto' }}
          />
        </Card>
      );
    })}
  </div>
);
