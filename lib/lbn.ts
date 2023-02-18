import { deserialize } from 'lbn-core/dist/helpers/serializer';

export const LBN_URL_REGEXP =
  /https:\/\/launchbaynext\.app\/\?lbx(?:[-a-zA-Z0-9()@:%_*'\\\+.~#?&\/=,]*)/;

export const lbn2xws = (link: string) => {
  const url = new URL(
    // link
    "https://launchbaynext.app/?lbx='*0%2C%20Emperors%20Sword%20*'.20.2.1.ll11.81.l1.233.237rr.l11.86.l14.299rr.l11.84.l6.267r.l14.619r.l1.233rr.l11.83.l3.256r.l1.233.915rr.l41.'secondsister'.l14.299r.l1.237rr.l11.90rr.l6.0.8r"
  );
  const params = Object.fromEntries(url.searchParams.entries()) as Record<
    'lbx',
    string
  >;

  console.log('S===========================================================');
  // const r = params.lbx.replace('"', "'").replace('\\', '');
  const r =
    // '%27Two%20Peas%20in%20a%20Pod%27.20.4.1.ll57.%27poedameron-scavengedyt1300%27.l8.274r.l16.478r.l13.877r.l14.296r.l1.247.381r.l15.485rr.l54.435.l14.299r.l1.241.471rr.l69.621.l10.644r.l13.931r.l14.619r.l1.%27notorious%27r.l15.655rr.l65.573.l8.473rr.l65.575.l8.275r.l1.471.233rrr.lr';
    "'Two%20Peas%20in%20a%20Pod'.20.4.1.ll57.'poedameron-scavengedyt1300'.l8.274r.l16.478r.l13.877r.l14.296r.l1.247.381r.l15.485rr.l54.435.l14.299r.l1.241.471rr.l69.621.l10.644r.l13.931r.l14.619r.l1.'notorious'r.l15.655rr.l65.573.l8.473rr.l65.575.l8.275r.l1.471.233rrr.lr";
  // "'*0%2C%20Emperors%20Sword%20*'.20.2.1.ll11.81.l1.233.237rr.l11.86.l14.299rr.l11.84.l6.267r.l14.619r.l1.233rr.l11.83.l3.256r.l1.233.915rr.l41.'secondsister'.l14.299r.l1.237rr.l11.90rr.l6.0.8r";
  // '%27*0%2C%20Emperors%20Sword%20*%27.20.2.1.ll11.81.l1.233.237rr.l11.86.l14.299rr.l11.84.l6.267r.l14.619r.l1.233rr.l11.83.l3.256r.l1.233.915rr.l41.%27secondsister%27.l14.299r.l1.237rr.l11.90rr.l6.0.8r';
  // console.log(decodeURIComponent(r));
  // console.log();
  // console.log('core', lbnCore(decodeURIComponent(r)));
  // console.log();
  // console.log('web', lbnWeb(decodeURIComponent(r)));

  // console.log(params.lbx);
  // console.log(params.lbx.replace(/\\\'/g, "'"));
  // console.log(deserialize(params.lbx.replace(/\\\'/g, "'")));
  console.log(deserialize(r));
  console.log('E===========================================================');

  return null;
};

const rep = (c: string, t: string, d: string | number) => {
  if (typeof d === 'number') {
    return `${d}`;
  }

  while (d.indexOf(c) >= 0) {
    d = d.replace(c, t);
  }
  return d;
};

const lbnWeb = (o: string) => {
  o = rep('%27%27', '%27%20%27', o);
  o = rep("''", "' '", o);
  o = o
    .split('.')
    .map((s, i) => {
      if (i > 2) {
        console.log(s);
        return rep('l', '(', rep('r', ')', s));
      }
      return s;
    })
    .join('.');
  o = rep('.', ',', o);

  o = rep('(', '[', o);
  o = rep(')', ']', o);
  o = rep("'", '"', o);
  o = rep('""', '"', o);

  if (o[0] !== '[') {
    o = `[${o}]`;
  }

  return o;
};

const lbnCore = (o: string) => {
  o = o
    .split('.')
    .map((s, i) => {
      if (i > 2) {
        return rep('l', '(', rep('r', ')', s));
      }
      return s;
    })
    .join('.');
  o = rep('.', ',', o);

  o = rep('(', '[', o);
  o = rep(')', ']', o);
  o = rep("'", '"', o);
  o = rep('""', '"', o);

  if (o[0] !== '[') {
    o = `[${o}]`;
  }

  return o;
};
