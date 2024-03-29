'use client';

import { useState } from 'react';
import { ResponsiveBar } from '@nivo/bar';

import { Button, Card, Dialog, Input } from '@/ui';
import { Cog } from '@/ui/icons';
import { getFactionName } from '@/lib/get-value';
import { FACTION_ABBR, FACTION_COLORS, round, toPercentage } from '@/lib/utils';
import type { XWSFaction } from '@/lib/types';

import { theme } from './theme';

// Helpers
// ---------------
/**
 * Based on FFGs tournament regulations. This is just to have
 * some sensible defaults.
 */
const getCutBySize = (size: number) => {
  if (size < 9) {
    return 2;
  }

  if (size >= 9 && size <= 12) {
    return 4;
  }

  if (size >= 13 && size <= 76) {
    return 8;
  }

  if (size >= 77 && size <= 148) {
    return 16;
  }

  return 32;
};

interface ConfigDialogProps {
  cut: number;
  updateCut: (cut: number) => void;
}

const ConfigDialog = ({ cut, updateCut }: ConfigDialogProps) => {
  const [value, setValue] = useState(cut);
  return (
    <Dialog>
      <Dialog.Trigger asChild>
        <Button
          className="text-secondary-200 hover:text-secondary-800"
          variant="link"
          size="inherit"
        >
          <Cog className="h-6 w-6" />
        </Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>Set number of included squads</Dialog.Title>
          <Dialog.Description>
            Change the below number to configure how much of the top placed
            squads should be included.
          </Dialog.Description>
        </Dialog.Header>
        <div className="py-2">
          <Input
            label="Number of Squads to include"
            type="number"
            value={value}
            onChange={e => setValue(e.target.valueAsNumber)}
          />
        </div>
        <Dialog.Footer>
          <Dialog.Close asChild>
            <Button>Cancel</Button>
          </Dialog.Close>
          <Dialog.Close asChild>
            <Button variant="primary" onClick={() => updateCut(value)}>
              Update
            </Button>
          </Dialog.Close>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );
};

// Props
// ---------------
export interface FactionCutProps {
  tournament: {
    count: { all: number };
    cut: number;
  };
  value: {
    [Faction in XWSFaction | 'unknown']: {
      ranks: number[];
      count: number;
    };
  };
}

// Component
// ---------------
export const FactionCut = ({ tournament, value }: FactionCutProps) => {
  const [cut, setCut] = useState(
    tournament.cut > 0 ? tournament.cut : getCutBySize(tournament.count.all)
  );

  const data = Object.entries(value)
    .map(([key, { count, ranks }]) => {
      const faction = key as XWSFaction | 'unknown';
      const cutsize = ranks.filter(rank => rank <= cut).length;
      const cutrate = count > 0 ? round(cutsize / count, 4) : 0;
      const diff =
        tournament.count.all > 0
          ? cutrate - round(count / tournament.count.all, 4)
          : 0;

      return {
        faction,
        count,
        cutsize,
        cutrate,
        diff,
      };
    })
    // Remove "uknown" if everything was parsed!
    .filter(({ faction, count }) => (faction !== 'unknown' ? true : count > 0));

  return (
    <Card>
      <Card.Header>
        <Card.Title>
          {tournament.cut
            ? `Faction Cut Rate (TOP${tournament.cut})`
            : `Faction Rate: TOP${cut}`}
        </Card.Title>
        {tournament.cut ? null : (
          <Card.Menu>
            <ConfigDialog cut={cut} updateCut={setCut} />
          </Card.Menu>
        )}
      </Card.Header>
      <div className="h-72">
        <ResponsiveBar
          data={[...data].sort((a, b) => a.cutrate - b.cutrate)}
          indexBy="faction"
          keys={['cutrate']}
          minValue={0}
          valueFormat={value => (value > 0 ? toPercentage(value) : '')}
          axisLeft={{
            format: toPercentage,
          }}
          axisBottom={{
            format: (faction: XWSFaction | 'unknown') => FACTION_ABBR[faction],
          }}
          theme={theme}
          colors={({ data }) => FACTION_COLORS[data.faction]}
          padding={0.15}
          margin={{ top: 10, right: 10, bottom: 20, left: 45 }}
          isInteractive={false}
          animate={false}
        />
      </div>
      <Card.Footer>
        <div className="grid grid-cols-2 gap-2 px-1 pt-2 lg:grid-cols-3">
          {data.map(({ faction, diff }) => (
            <div
              key={faction}
              className="flex items-center gap-1 text-xs text-secondary-900"
            >
              <div
                className="h-2 w-2"
                style={{ background: FACTION_COLORS[faction] }}
              />
              <div className="font-medium">
                {faction === 'unknown' ? 'Unknown' : getFactionName(faction)}:
              </div>
              {toPercentage(diff, { sign: true })}
            </div>
          ))}
        </div>
      </Card.Footer>
    </Card>
  );
};
