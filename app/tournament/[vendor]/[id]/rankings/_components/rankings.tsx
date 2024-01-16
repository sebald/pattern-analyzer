import type { CSSProperties } from 'react';

import { getFactionName } from '@/lib/get-value';
import { SquadData } from '@/lib/types';
import { cn } from '@/lib/utils/classname.utils';
import { round } from '@/lib/utils/math.utils';

import { Card, Detail, FactionIcon } from '@/ui';

// Props
// ---------------
export interface RankingsProps {
  squads: SquadData[];
}

// View
// ---------------
export const Rankings = ({ squads }: RankingsProps) => (
  <div className="grid grid-cols-[max-content,1fr,1fr,1fr,max-content] gap-x-3 gap-y-3 md:gap-x-6">
    {squads.map(current => {
      const rank = current.rank.elimination || current.rank.swiss;

      return (
        <Card
          key={current.player}
          inset="headless"
          subgrid
          className="items-center pr-4"
        >
          <div className="flex items-center justify-center">
            <div>
              <div
                className={cn(
                  'text-center text-lg font-bold md:text-2xl',
                  rank === 1 && 'text-amber-500',
                  rank === 2 && 'text-zinc-500',
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
          <div className="flex flex-col gap-1 lg:pl-2">
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
          <Detail label="Points" value={current.points} />
          <Detail
            label="W/D/L"
            value={
              <>
                <span>{current.record.wins}</span>/
                <span>{current.record.ties}</span>/
                <span>{current.record.losses}</span>
              </>
            }
          />
          <Detail label="SOS" value={round(current.sos, 2)} />
        </Card>
      );
    })}
  </div>
);
