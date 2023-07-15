import {
  composition,
  faction,
  pilot,
  pilotCostDistribution,
  pilotSkillDistribution,
  ship,
  squadSize,
  upgrade,
} from '@/lib/stats/module';
import { setup } from '@/lib/stats';

import { squads } from './squads.fixture';

test('create stats (tournament)', () => {
  const stats = setup([])([squads]);
  expect(stats.tournament).toMatchSnapshot();
});

test('create stats (faction)', () => {
  const stats = setup([faction])([squads]);
  expect(stats.faction).toMatchSnapshot();
});

test('create stats (squadSize)', () => {
  const stats = setup([squadSize])([squads]);
  expect(stats.squadSize).toMatchSnapshot();
});

test('create stats (pilot)', () => {
  const stats = setup([pilot])([squads]);
  expect(stats.pilot).toMatchSnapshot();
});

test('create stats (pilotCostDistribution)', () => {
  const stats = setup([pilotCostDistribution])([squads]);
  expect(stats.pilotCostDistribution).toMatchSnapshot();
});

test('create stats (pilotSkillDistribution)', () => {
  const stats = setup([pilotSkillDistribution])([squads]);
  expect(stats.pilotSkillDistribution).toMatchSnapshot();
});

test('create stats (upgrade)', () => {
  const stats = setup([upgrade])([squads]);
  expect(stats.upgrade).toMatchSnapshot();
});

test('create stats (ship)', () => {
  const stats = setup([ship])([squads]);
  expect(stats.ship).toMatchSnapshot();
});

test('create stats (composition)', () => {
  const stats = setup([composition])([squads]);
  expect(stats.composition).toMatchSnapshot();
});

// =======

test('create stats (multiple)', () => {
  const stats = setup([faction, pilot])([squads]);
  expect(stats).toMatchSnapshot();
});
