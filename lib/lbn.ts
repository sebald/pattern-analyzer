import { deserialize } from 'lbn-core/dist/helpers/serializer';

export const LBN_URL_REGEXP =
  /https:\/\/launchbaynext\.app\/\?lbx(?:[-a-zA-Z0-9()@:%_*'\\\+.~#?&\/=,]*)/;

export const lbn2xws = (link: string) => {
  const url = new URL(link);
  const params = Object.fromEntries(url.searchParams.entries()) as Record<
    'lbx',
    string
  >;
  console.log(params.lbx);
  console.log(deserialize(params.lbx.replace(/\\'/g, '"')));
  // helpers.serializer.deserialize;

  return null;
};
