import { XWSSquad } from './types';

export const yasb2xws = async (url: string) => {
  // Currently only supporting YASB links
  if (!/yasb\.app/.test(url)) {
    return null;
  }

  // Get XWS using https://github.com/zacharyp/squad2xws
  let res: Response;
  try {
    res = await fetch(
      url.replace(
        'https://yasb.app',
        'https://squad2xws.objectivecat.com/yasb/xws'
      )
    );
  } catch {
    throw new Error('Failed to get XWS..');
  }

  if (!res.ok) {
    throw new Error(`Failed to fetch XWS data for ${url}...`);
  }

  let xws;
  try {
    xws = await res.json();
  } catch {
    throw new Error(`Failed to parse JSON for ${url}...`);
  }

  return xws as XWSSquad;
};
