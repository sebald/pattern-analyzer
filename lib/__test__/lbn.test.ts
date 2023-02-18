import { lbn2xws } from 'lib/lbn';

test.each([
  "https://launchbaynext.app/?lbx='*0%2C%20Emperors%20Sword%20*'.20.2.1.ll11.81.l1.233.237rr.l11.86.l14.299rr.l11.84.l6.267r.l14.619r.l1.233rr.l11.83.l3.256r.l1.233.915rr.l41.'secondsister'.l14.299r.l1.237rr.l11.90rr.l6.0.8r",
])('transform lbn link to XWS', link => {
  console.log(lbn2xws(link));
});

test('lbn link transforation can handle broken link', () => {
  expect(lbn2xws('')).toEqual(null);
  expect(
    lbn2xws(
      'https://launchbaynext.app/?lbx=%27New%20Squadron%27.20.4.1.ll57.%27poedameron-scavengedyt1300%'
    )
  ).toEqual(null);
});
