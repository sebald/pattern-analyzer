import type { Ships } from 'lib/get-value';
import type { XWSFaction } from 'lib/types';

export interface PilotStatData {
  ship: Ships;
  count: number;
  records: { wins: number; ties: number; losses: number }[];
  ranks: number[];
  frequency: number;
  percentile: number;
  winrate: number;
  deviation: number;
}

export const FACTION_COLORS_LIGHT: { [key in XWSFaction | 'unknown']: string } =
  {
    rebelalliance: '#fecaca',
    galacticempire: '#93c5fd',
    scumandvillainy: '#fde68a',
    resistance: '#fdba74',
    firstorder: '#f87171',
    galacticrepublic: '#fda4af',
    separatistalliance: '#a5b4fc',
    unknown: '#e2e8f0',
  };

export const FACTION_COLORS_DARK: { [key in XWSFaction | 'unknown']: string } =
  {
    rebelalliance: '#fa0a0a',
    galacticempire: '#034ea2',
    scumandvillainy: '#997b03',
    resistance: '#f88004',
    firstorder: '#9d0808',
    galacticrepublic: '#eb0522',
    separatistalliance: '#0627c3',
    unknown: '#202d3d',
  };

export const toPercentage = (value: number) =>
  new Intl.NumberFormat('default', {
    style: 'percent',
    minimumFractionDigits: 0,
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
