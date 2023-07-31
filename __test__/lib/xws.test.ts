import { parsePilotId } from '@/lib/xws';

test('normalize pilot', () => {
  expect(parsePilotId('hansoloboy', 'rebelalliance')).toMatchInlineSnapshot(
    `"hansolo-battleofyavin"`
  );
  expect(
    parsePilotId('countdookusoc', 'separatistalliance')
  ).toMatchInlineSnapshot(`"countdooku-siegeofcoruscant"`);
  expect(parsePilotId('dbs404soc', 'separatistalliance')).toMatchInlineSnapshot(
    `"dbs404-siegeofcoruscant"`
  );
  expect(
    parsePilotId('durgeseparatist', 'separatistalliance')
  ).toMatchInlineSnapshot(`"durge-separatistalliance"`);
});
