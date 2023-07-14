import { factory } from '@/lib/stats/module/factory';
import {
  composition,
  faction,
  pilot,
  pilotCostDistribution,
  pilotSkillDistribution,
  ship,
  squadSizes,
  upgrade,
} from '@/lib/stats/module';

import { squads } from './squads.fixture';

test('create stats (tournament)', () => {
  const stats = factory([])(squads);
  expect(stats.tournament).toMatchSnapshot();
});

test('create stats (faction)', () => {
  const stats = factory([faction()])(squads);
  expect(stats.faction).toMatchSnapshot();
});

test('create stats (squadSizes)', () => {
  const stats = factory([squadSizes()])(squads);
  expect(stats.squadSizes).toMatchSnapshot();
});

test('create stats (pilot)', () => {
  const stats = factory([pilot()])(squads);
  expect(stats.pilot).toMatchSnapshot();
});

test('create stats (pilotCostDistribution)', () => {
  const stats = factory([pilotCostDistribution()])(squads);
  expect(stats.pilotCostDistribution).toMatchSnapshot();
});

test('create stats (pilotSkillDistribution)', () => {
  const stats = factory([pilotSkillDistribution()])(squads);
  expect(stats.pilotSkillDistribution).toMatchSnapshot();
});

test('create stats (upgrade)', () => {
  const stats = factory([upgrade()])(squads);
  expect(stats.upgrade).toMatchSnapshot();
});

test('create stats (ship)', () => {
  const stats = factory([ship()])(squads);
  expect(stats.ship).toMatchSnapshot();
});

test('create stats (composition)', () => {
  const stats = factory([composition()])(squads);
  expect(stats.composition).toMatchSnapshot();
});

// =======

test('create stats (multiple)', () => {
  const stats = factory([faction(), pilot()])(squads);
  expect(stats).toMatchSnapshot();
});
