import { compositionDetails } from '@/lib/stats/details/composition';
import { pilotDetails } from '@/lib/stats/details/pilot';

const count = {} as any;

/**
 * Regression: an empty window used to throw while deriving the faction from the
 * first squad, which the page then reported as a 404.
 */
test('composition details are empty if nothing was flown', () => {
  expect(
    compositionDetails({ composition: 'xwing.xwing', squads: [], count })
  ).toBeNull();
});

test('pilot details are empty if nothing was flown', () => {
  expect(
    pilotDetails({ pilot: 'lukeskywalker', squads: [], count })
  ).toBeNull();
});
