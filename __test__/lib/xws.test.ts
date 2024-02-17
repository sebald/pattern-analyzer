import { parsePilotId, toXWS } from '@/lib/xws';

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

test('parse raw to XWS', () => {
  // from: /api/longshanks/12531/xws/10410
  const raw =
    "{'name':'All Clones','description':'','faction':'galacticrepublic','points':20,'version':'11/25/2022.NaN.NaN','obstacles':['coreasteroid0','coreasteroid1','coreasteroid2'],'pilots':[{'id':'kickback-siegeofcoruscant','ship':'v19torrentstarfighter','points':3,'upgrades':{}},{'id':'killer','ship':'clonez95headhunter','points':3,'upgrades':{'talent':['dedicated'],'missile':['concussionmissiles'],'modification':['synchronizedconsole'],'sensor':['firecontrolsystem']}},{'id':'kickback-sigeofcoruscant','ship':'v19torrentstarfighter','points':0,'upgrades':{}},{'id':'contrail','ship':'nimbusclassvwing','points':3,'upgrades':{'talent':['swarmtactics'],'astromech':['r3astromech'],'configuration':['alpha3bbesh'],'modification':['synchronizedconsole']}},{'id':'klick','ship':'nimbusclassvwing','points':3,'upgrades':{'talent':['dedicated'],'astromech':['r3astromech'],'configuration':['alpha3bbesh'],'modification':['synchronizedconsole']}},{'id':'axe-siegeofcoruscant','ship':'v19torrentstarfighter','points':3,'upgrades':{}},{'id':'oddball-nimbusclassvwing','ship':'nimbusclassvwing','points':3,'upgrades':{'configuration':['alpha3eesk'],'talent':['dedicated'],'torpedo':['plasmatorpedoes'],'modification':['synchronizedconsole']}},{'id':'boost','ship':'clonez95headhunter','points':2,'upgrades':{'talent':['dedicated']}}],'vendor':{'lbn':{'builder':'Launch Bay Next','builder_url':'https://launchbaynext.app','link':'https://launchbaynext.app/print?lbx='All%20Clones'.20.6.0.ll62.'kickback-siegeofcoruscant'r.l'clonez95headhunter'.'killer'.l6.267r.l14.554r.l2.254r.l1.544rr.l62.'kickback-sigeofcoruscant'r.l71.789.l10.283r.l18.870r.l14.554r.l1.246rr.l71.790.l10.283r.l18.870r.l14.554r.l1.544rr.l62.'axe-siegeofcoruscant'r.l71.788.l18.871r.l14.554r.l1.544r.l5.579rr.l'clonez95headhunter'.'boost'.l1.544rrr.l0.1.2r','uid':'210ef8a1-6c8c-4c20-9877-284993b1d7ad','wins':0,'losses':0,'tags':[],'created':'2023-01-30T06:17:45.548Z'}}}";
  expect(() => toXWS(raw)).not.toThrow();
});
