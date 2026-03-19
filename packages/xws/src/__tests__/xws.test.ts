import { describe, expect, it } from 'vitest';
import {
  parsePilotId,
  normalize,
  toXWS,
  getPilots,
  getBuilderLink,
  upgradesToList,
  isStandardized,
  toCompositionId,
  toFaction,
} from '../xws';
import type { XWSSquad } from '../types';

// Helpers
// ---------------
const makeSquad = (overrides: Partial<XWSSquad> = {}): XWSSquad => ({
  faction: 'rebelalliance',
  pilots: [],
  points: 20,
  vendor: {},
  version: '2.5',
  name: 'Test Squad',
  ...overrides,
});

// Tests
// ---------------
describe('parsePilotId', () => {
  it('normalizes BoY suffix', () => {
    expect(parsePilotId('hansoloboy', 'rebelalliance')).toBe('hansolo-battleofyavin');
    expect(parsePilotId('garvendreisboy', 'rebelalliance')).toBe('garvendreis-battleofyavin');
  });

  it('normalizes SoC suffix', () => {
    expect(parsePilotId('countdookusoc', 'separatistalliance')).toBe(
      'countdooku-siegeofcoruscant'
    );
    expect(parsePilotId('dbs404soc', 'separatistalliance')).toBe(
      'dbs404-siegeofcoruscant'
    );
  });

  it('normalizes separatist suffix', () => {
    expect(parsePilotId('durgeseparatist', 'separatistalliance')).toBe(
      'durge-separatistalliance'
    );
  });

  it('resolves PILOT_ID_MAP entries directly', () => {
    expect(parsePilotId('maulermither-battleofyavin', 'galacticempire')).toBe(
      'maulermithel-battleofyavin'
    );
    expect(parsePilotId('dt798-tiefofighter', 'galacticempire')).toBe('dt798');
    expect(parsePilotId('poedameron-2', 'resistance')).toBe('poedameron-swz68');
    expect(parsePilotId('poedameronhoh', 'resistance')).toBe('poedameron-swz68');
    expect(parsePilotId('corranhornxwing', 'rebelalliance')).toBe(
      'corranhorn-t65xwing'
    );
  });

  it('resolves PILOT_ID_MAP entries with faction appended', () => {
    expect(parsePilotId('hansolo', 'rebelalliance')).toBe(
      'hansolo-modifiedyt1300lightfreighter'
    );
  });

  it('returns the regex-transformed value when not in map', () => {
    expect(parsePilotId('somepilot', 'rebelalliance')).toBe('somepilot');
  });
});

describe('normalize', () => {
  it('returns null for null input', () => {
    expect(normalize(null)).toBeNull();
  });

  it('normalizes pilot IDs via parsePilotId', () => {
    const squad = makeSquad({
      pilots: [
        { id: 'maulermither-battleofyavin', ship: 'tielnfighter' as any, points: 3, upgrades: {} },
      ],
    });
    const result = normalize(squad)!;
    expect(result.pilots[0].id).toBe('maulermithel-battleofyavin');
  });

  it('adds standard loadout upgrades and points', () => {
    const squad = makeSquad({
      pilots: [
        {
          id: 'garvendreis-battleofyavin',
          ship: 't65xwing' as any,
          points: 0,
          upgrades: {},
        },
      ],
    });
    const result = normalize(squad)!;
    // Standard loadout should add points and upgrades
    expect(result.pilots[0].points).toBe(12);
    expect(result.pilots[0].upgrades.torpedo).toEqual(['advprotontorpedoes']);
  });

  it('fixes known upgrade ID typos', () => {
    const squad = makeSquad({
      pilots: [
        {
          id: 'somepilot',
          ship: 't65xwing' as any,
          points: 5,
          upgrades: { crew: ['r2d2resistance', 'choppercrew'] },
        },
      ],
    });
    const result = normalize(squad)!;
    expect(result.pilots[0].upgrades.crew).toEqual(['r2d2-resistance', 'chopper-crew']);
  });

  it('corrects LBN points cost of 100 using YASB data', () => {
    const squad = makeSquad({
      pilots: [
        {
          id: 'wedgeantilles',
          ship: 't65xwing' as any,
          points: 100,
          upgrades: {},
        },
      ],
    });
    const result = normalize(squad)!;
    expect(result.pilots[0].points).not.toBe(100);
    expect(result.pilots[0].points).toBeGreaterThan(0);
  });

  it('preserves the rest of the squad', () => {
    const squad = makeSquad({
      name: 'My Squad',
      faction: 'galacticempire',
      pilots: [
        { id: 'somepilot', ship: 'tielnfighter' as any, points: 3, upgrades: {} },
      ],
    });
    const result = normalize(squad)!;
    expect(result.name).toBe('My Squad');
    expect(result.faction).toBe('galacticempire');
  });
});

describe('toXWS', () => {
  it('parses standard JSON to XWSSquad', () => {
    const json = JSON.stringify({
      faction: 'rebelalliance',
      pilots: [{ id: 'lukeskywalker', ship: 't65xwing', points: 5, upgrades: {} }],
      points: 20,
      vendor: {},
      version: '2.5',
      name: 'Test',
    });
    const result = toXWS(json);
    expect(result).not.toBeNull();
    expect(result!.faction).toBe('rebelalliance');
  });

  it('parses single-quoted LBN JSON', () => {
    const raw =
      "{'name':'Test','faction':'galacticrepublic','points':20,'version':'2.6.0','pilots':[{'id':'klick','ship':'nimbusclassvwing','points':3,'upgrades':{}}],'vendor':{'lbn':{'builder':'Launch Bay Next','builder_url':'https://launchbaynext.app','link':'https://launchbaynext.app/print?lbx=test','uid':'abc'}}}";
    const result = toXWS(raw);
    expect(result).not.toBeNull();
    expect(result!.faction).toBe('galacticrepublic');
    expect(result!.pilots[0].id).toBe('klick');
  });

  it('throws on unparseable input', () => {
    expect(() => toXWS('not json at all {')).toThrow('[xws] Could not parse raw value...');
  });

  it('handles LBN print links with single quotes', () => {
    const raw =
      "{'name':'All Clones','description':'','faction':'galacticrepublic','points':20,'version':'11/25/2022.NaN.NaN','obstacles':['coreasteroid0','coreasteroid1','coreasteroid2'],'pilots':[{'id':'kickback-siegeofcoruscant','ship':'v19torrentstarfighter','points':3,'upgrades':{}}],'vendor':{'lbn':{'builder':'Launch Bay Next','builder_url':'https://launchbaynext.app','link':'https://launchbaynext.app/print?lbx='All%20Clones'.20.6.0.ll62.'kickback-siegeofcoruscant'r','uid':'test'}}}";
    expect(() => toXWS(raw)).not.toThrow();
    const result = toXWS(raw);
    expect(result!.faction).toBe('galacticrepublic');
  });
});

describe('getPilots', () => {
  it('extracts pilot IDs from squad', () => {
    const squad = makeSquad({
      pilots: [
        { id: 'luke', ship: 't65xwing' as any, points: 5, upgrades: {} },
        { id: 'wedge', ship: 't65xwing' as any, points: 5, upgrades: {} },
      ],
    });
    expect(getPilots(squad)).toEqual(['luke', 'wedge']);
  });

  it('returns empty array for empty squad', () => {
    expect(getPilots(makeSquad())).toEqual([]);
  });
});

describe('getBuilderLink', () => {
  it('returns YASB link when available', () => {
    const squad = makeSquad({
      vendor: { yasb: { builder: '', builder_url: '', version: '', link: 'https://yasb.app/?f=...' } },
    });
    expect(getBuilderLink(squad)).toBe('https://yasb.app/?f=...');
  });

  it('returns LBN link (without print) when no YASB link', () => {
    const squad = makeSquad({
      vendor: { lbn: { builder: '', builder_url: '', version: '', link: 'https://launchbaynext.app/print?lbx=...' } },
    });
    expect(getBuilderLink(squad)).toBe('https://launchbaynext.app/?lbx=...');
  });

  it('prefers YASB over LBN', () => {
    const squad = makeSquad({
      vendor: {
        yasb: { builder: '', builder_url: '', version: '', link: 'https://yasb.app' },
        lbn: { builder: '', builder_url: '', version: '', link: 'https://lbn.app/print' },
      },
    });
    expect(getBuilderLink(squad)).toBe('https://yasb.app');
  });

  it('returns null for null input', () => {
    expect(getBuilderLink(null)).toBeNull();
  });

  it('returns null when no vendor links', () => {
    expect(getBuilderLink(makeSquad())).toBeNull();
  });
});

describe('upgradesToList', () => {
  it('converts upgrades map to comma-separated display names', () => {
    const result = upgradesToList({ talent: ['lonewolf'], torpedo: ['protontorpedoes'] });
    expect(result).toContain('Lone Wolf');
    expect(result).toContain('Proton Torpedoes');
    expect(result).toContain(', ');
  });

  it('falls back to xws id when no display name found', () => {
    const result = upgradesToList({ talent: ['nonexistent'] });
    expect(result).toBe('nonexistent');
  });

  it('returns empty string for empty upgrades', () => {
    expect(upgradesToList({})).toBe('');
  });
});

describe('isStandardized', () => {
  it('returns true for standard loadout pilots', () => {
    expect(isStandardized('garvendreis-battleofyavin')).toBe(true);
  });

  it('returns false for non-standard pilots', () => {
    expect(isStandardized('wedgeantilles')).toBe(false);
  });
});

describe('toCompositionId', () => {
  it('creates sorted ship composition id', () => {
    const squad = makeSquad({
      pilots: [
        { id: 'b', ship: 'tielnfighter' as any, points: 2, upgrades: {} },
        { id: 'a', ship: 'asf01bwing' as any, points: 3, upgrades: {} },
        { id: 'c', ship: 't65xwing' as any, points: 4, upgrades: {} },
      ],
    });
    expect(toCompositionId(squad)).toBe('asf01bwing.t65xwing.tielnfighter');
  });

  it('handles duplicate ships', () => {
    const squad = makeSquad({
      pilots: [
        { id: 'a', ship: 't65xwing' as any, points: 3, upgrades: {} },
        { id: 'b', ship: 't65xwing' as any, points: 3, upgrades: {} },
      ],
    });
    expect(toCompositionId(squad)).toBe('t65xwing.t65xwing');
  });
});

describe('toFaction', () => {
  it('returns valid faction as-is', () => {
    expect(toFaction('rebelalliance')).toBe('rebelalliance');
    expect(toFaction('galacticempire')).toBe('galacticempire');
    expect(toFaction('scumandvillainy')).toBe('scumandvillainy');
    expect(toFaction('resistance')).toBe('resistance');
    expect(toFaction('firstorder')).toBe('firstorder');
    expect(toFaction('galacticrepublic')).toBe('galacticrepublic');
    expect(toFaction('separatistalliance')).toBe('separatistalliance');
  });

  it('returns unknown for invalid values', () => {
    expect(toFaction('garbage')).toBe('unknown');
    expect(toFaction('')).toBe('unknown');
  });

  it('returns unknown for null/undefined', () => {
    expect(toFaction(null)).toBe('unknown');
    expect(toFaction(undefined)).toBe('unknown');
  });
});
