import { XWSFaction } from 'lib/types';

export const FACTION_COLORS: { [key in XWSFaction | 'unknown']: string } = {
  rebelalliance: '#fecaca',
  galacticempire: '#93c5fd',
  scumandvillainy: '#fde68a',
  resistance: '#fdba74',
  firstorder: '#f87171',
  galacticrepublic: '#fda4af',
  separatistalliance: '#a5b4fc',
  unknown: '#e2e8f0',
};

export const FooterHint = () => (
  <div className="px-1 pt-1 text-xs text-secondary-300">
    *This data does not include unknown squads. Only squads that could be parsed
    are included.
  </div>
);

export const toPercentage = (value: number) =>
  new Intl.NumberFormat('default', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

export const calcWeightedAverage = (
  map: { [key: number]: number },
  total: number
) =>
  Object.entries(map).reduce((mean, [size, count]) => {
    mean = mean + Number(size) * count;
    return mean;
  }, 0) / total;
