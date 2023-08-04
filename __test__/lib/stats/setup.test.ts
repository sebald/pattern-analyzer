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
import { toSquadEntitiy } from '@/lib/transform';

import fixture from './squads.fixture';

const squads = fixture.map(sq =>
  toSquadEntitiy(sq, {
    total: fixture.length,
    date: new Date(), // FIXME: we do not need this here really, right?
  })
);
const config = {
  tournaments: 1,
  count: {
    all: squads.length,
    rebelalliance: 0,
    galacticempire: 0,
    scumandvillainy: 0,
    resistance: 0,
    firstorder: 0,
    galacticrepublic: 0,
    separatistalliance: 0,
    unknown: 0,
  },
};

squads.forEach(sq => {
  config.count[sq.xws?.faction ?? 'unknown'] += 1;
});

test('create stats (faction)', () => {
  const stats = setup([faction])(squads, config);
  expect(stats.faction).toMatchSnapshot();
});

test('create stats (squadSize)', () => {
  const stats = setup([squadSize])(squads, config);
  expect(stats.squadSize).toMatchSnapshot();
});

test('create stats (pilot)', () => {
  const stats = setup([pilot])(squads, config);
  expect(stats.pilot).toMatchSnapshot();
});

test('create stats (pilotCostDistribution)', () => {
  const stats = setup([pilotCostDistribution])(squads, config);
  expect(stats.pilotCostDistribution).toMatchSnapshot();
});

test('create stats (pilotSkillDistribution)', () => {
  const stats = setup([pilotSkillDistribution])(squads, config);
  expect(stats.pilotSkillDistribution).toMatchSnapshot();
});

test('create stats (upgrade)', () => {
  const stats = setup([upgrade])(squads, config);
  expect(stats.upgrade).toMatchSnapshot();
});

test('create stats (ship)', () => {
  const stats = setup([ship])(squads, config);
  expect(stats.ship).toMatchSnapshot();
});

test('create stats (composition)', () => {
  const stats = setup([composition])(squads, config);
  expect(stats.composition).toMatchSnapshot();
});

// =======

test('create stats (multiple)', () => {
  const stats = setup([faction, pilot])(squads, config);
  expect(stats).toMatchSnapshot();
});
