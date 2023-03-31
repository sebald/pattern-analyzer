const getData = async (id: string) => {
  const api_url = `https://listfortress.com/api/v1/tournaments/${id}`;
  const res = await fetch(api_url);

  if (!res.ok) {
    throw new Error(`[listfortress] Failed to fetch event data... (${id})`);
  }
  // TODO: Listfortress may have a bug that all matches data is empty. this means we can not take full advantage of it :-(
  return res.json();
};

export const getEventInfo = async (id: string) => {};

export const getEvent = async (id: string) => {};
