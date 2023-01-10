const URL_REGEXP =
  /https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)/;

const getListsFromEvent = async (event: string) => {
  const res = await fetch(
    `https://longshanks.org/events/detail/?event=${event}`
  );

  if (!res.ok) {
    throw new Error('Failed to fetch event data...');
  }

  const html = await res.text();

  /**
   * Poor mans web scraper...
   */
  const matches = html.matchAll(
    /id=\"(?<id>list_\d+)\" value=\"(?<value>[^"]*)\"/g
  );
  const lists = Array.from(matches, m => {
    const val = m.groups?.value;
    const id = m.groups?.id!;

    if (!val) return { id };

    const matches = val.replace(/\n/g, ' ').match(URL_REGEXP);
    console.log(matches);

    return {
      id,
      link: matches ? matches[0] : 'TODO: FIX ME!',
    };
  });

  return lists;
};

export interface PageParams {
  params: {
    event: string;
  };
}

const Page = async ({ params }: PageParams) => {
  const data = await getListsFromEvent(params.event);

  return (
    <ul>
      {data.map(item => (
        <li key={item.id}>
          {item.id}: {item.link}
        </li>
      ))}
    </ul>
  );
};

export default Page;
