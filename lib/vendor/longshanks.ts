import { load } from 'cheerio';

// Fetch
// ---------------
const getEventHomepage = async (id: string) => {
  const url = `https://longshanks.org/events/detail/?event=${id}`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`[longshanks] Failed to fetch event data... (${id})`);
  }

  const html = await res.text();
  const $ = load(html);

  const name =
    $('head meta[property=og:title]').attr('content') || 'Unknown Event';
  const description =
    $('head meta[property=og:description]').attr('content') || '•';
  const [date] = description.split('•');

  return { name, date: date.trim() };
};

// API
// ---------------
export const getEventInfo = async (id: string) => {
  const { name, date } = await getEventHomepage(id);

  return {
    name,
    date,
    url: `https://longshanks.org/events/detail/?event=${id}`,
    vendor: 'longshanks',
  };
};
