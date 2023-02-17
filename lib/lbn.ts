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
    // "'*0%2C%20Emperors%20Sword%20*'.20.2.1.ll11.81.l1.233.237rr.l11.86.l14.299rr.l11.84.l6.267r.l14.619r.l1.233rr.l11.83.l3.256r.l1.233.915rr.l41.'secondsister'.l14.299r.l1.237rr.l11.90rr.l6.0.8r";
    '%27*0%2C%20Emperors%20Sword%20*%27.20.2.1.ll11.81.l1.233.237rr.l11.86.l14.299rr.l11.84.l6.267r.l14.619r.l1.233rr.l11.83.l3.256r.l1.233.915rr.l41.%27secondsister%27.l14.299r.l1.237rr.l11.90rr.l6.0.8r';
  console.log(decodeURIComponent(r));
  console.log(lbnCore(decodeURIComponent(r)));
  console.log(lbnWeb(decodeURIComponent(r)));

  // console.log(params.lbx);
  // console.log(params.lbx.replace(/\\\'/g, "'"));
  // console.log(deserialize(params.lbx.replace(/\\\'/g, "'")));
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
