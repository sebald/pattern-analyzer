import { deserialize } from 'lbn-core/dist/helpers/serializer';

export const LBN_URL_REGEXP =
  /https:\/\/launchbaynext\.app\/\?lbx(?:[-a-zA-Z0-9()@:%_*'\\\+.~#?&\/=,]*)/;

export const lbn2xws = (link: string) => {
  // const url = new URL(link);
  const url = new URL(
    "https://launchbaynext.app/?lbx='New%20Squadron'.5.2.1.ll41.'secondsister'.l14.299r.l1.237rrr.lr"
  );
  const params = Object.fromEntries(url.searchParams.entries()) as Record<
    'lbx',
    string
  >;
  console.log('============================================================');
  console.log(params.lbx);
  console.log(params.lbx.replace(/\\\'/g, "'"));
  console.log(deserialize(params.lbx.replace(/\\\'/g, "'")));
  console.log('============================================================');

  return null;
};
