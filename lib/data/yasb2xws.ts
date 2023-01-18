export const yasb2xws = (link: string) => {
  const url = new URL(link);

  const params = Object.fromEntries(url.searchParams.entries()) as Record<
    'f' | 'd' | 'sn' | 'obs',
    string
  >;

  const faction = params.f.replace(/\s/g, '').toLowerCase();

  const matches = params.d.match(/^v(\d+)Z(.*)/);
  console.log(params.d);
  console.log(matches[2].split('Z'));

  return { faction };
};
