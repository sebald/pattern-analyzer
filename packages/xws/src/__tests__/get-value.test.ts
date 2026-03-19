import { describe, expect, it } from 'vitest';
import {
  getAllFactions,
  getFactionByShip,
  getFactionName,
  getPilotName,
  getShipName,
  getStandardShips,
  getUpgradeName,
} from '../get-value';

describe('getFactionName', () => {
  it('returns human-readable faction name', () => {
    expect(getFactionName('rebelalliance')).toBe('Rebel Alliance');
    expect(getFactionName('galacticempire')).toBe('Galactic Empire');
    expect(getFactionName('scumandvillainy')).toBe('Scum and Villainy');
    expect(getFactionName('resistance')).toBe('Resistance');
    expect(getFactionName('firstorder')).toBe('First Order');
    expect(getFactionName('galacticrepublic')).toBe('Galactic Republic');
    expect(getFactionName('separatistalliance')).toBe('Separatist Alliance');
  });
});

describe('getAllFactions', () => {
  it('returns all 7 factions with id and name', () => {
    const factions = getAllFactions();
    expect(factions).toHaveLength(7);
    expect(factions[0]).toEqual({ id: 'rebelalliance', name: 'Rebel Alliance' });
  });
});

describe('getShipName', () => {
  it('returns ship display name for valid xws id', () => {
    expect(getShipName('t65xwing')).toBe('T-65 X-wing');
    expect(getShipName('tielnfighter')).toBe('TIE/ln Fighter');
  });

  it('returns null for unknown ship', () => {
    expect(getShipName('nonexistent')).toBeNull();
  });
});

describe('getPilotName', () => {
  it('returns pilot display name for valid xws id', () => {
    expect(getPilotName('lukeskywalker')).toBe('Luke Skywalker');
    expect(getPilotName('wedgeantilles')).toBe('Wedge Antilles');
  });

  it('returns null for unknown pilot', () => {
    expect(getPilotName('nonexistent')).toBeNull();
  });
});

describe('getUpgradeName', () => {
  it('returns upgrade display name for valid xws id', () => {
    expect(getUpgradeName('lonewolf')).toBe('Lone Wolf');
    expect(getUpgradeName('predator')).toBe('Predator');
  });

  it('returns null for unknown upgrade', () => {
    expect(getUpgradeName('nonexistent')).toBeNull();
  });
});

describe('getStandardShips', () => {
  it('returns array of ship ids for a faction', () => {
    const ships = getStandardShips('rebelalliance');
    expect(Array.isArray(ships)).toBe(true);
    expect(ships.length).toBeGreaterThan(0);
    expect(ships).toContain('t65xwing');
  });
});

describe('getFactionByShip', () => {
  it('returns the faction that owns a given ship', () => {
    expect(getFactionByShip('t65xwing')).toBe('rebelalliance');
    expect(getFactionByShip('tielnfighter')).toBe('rebelalliance'); // shared with rebels
  });

  it('returns a valid faction for empire ships', () => {
    expect(getFactionByShip('tieadvancedx1')).toBe('galacticempire');
  });
});
