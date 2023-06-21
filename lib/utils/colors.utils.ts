import type { XWSFaction } from '@/lib/types';

export const FACTION_COLORS: { [key in XWSFaction | 'unknown']: string } = {
  rebelalliance: '#fca5a5',
  galacticempire: '#93c5fd',
  scumandvillainy: '#fcd34d',
  resistance: '#fb923c',
  firstorder: '#f87171',
  galacticrepublic: '#fbcfe8',
  separatistalliance: '#a5b4fc',
  unknown: '#cbd5e1',
};

export const FACTION_ABBR: { [key in XWSFaction | 'unknown']: string } = {
  rebelalliance: 'REB',
  galacticempire: 'EMP',
  scumandvillainy: 'SCUM',
  resistance: 'RES',
  firstorder: 'FO',
  galacticrepublic: 'GAR',
  separatistalliance: 'CIS',
  unknown: '???',
};

export const COLOR_MAP = {
  3: '#e5ecfa',
  4: '#d0dcf5',
  5: '#b4c5ed',
  6: '#96a6e3',
  7: '#8490db',
  8: '#6167ca',
};
