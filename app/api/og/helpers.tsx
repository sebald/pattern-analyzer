export const Logo = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="#3c4073"
    stroke-width="2"
    width="256"
    height="256"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z"
    />
  </svg>
);

// Stolen from : https://www.jacobparis.com/guides/remix-og
export const getGoogleFont = async (
  font: string,
  weights = [400, 500, 600, 700],
  text = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/\\!@#$%^&*()_+-=<>?[]{}|;:,.`\'’"–—'
) => {
  const css = await fetch(
    `https://fonts.googleapis.com/css2?family=${font}:wght@${weights.join(
      ';'
    )}&text=${encodeURIComponent(text)}`,
    {
      headers: {
        // Make sure it returns TTF.
        'User-Agent':
          'Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; de-at) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1',
      },
    }
  ).then(response => response.text());
  const resource = css.matchAll(
    /src: url\((.+)\) format\('(opentype|truetype)'\)/g
  );
  return Promise.all(
    [...resource]
      .map(match => match[1])
      .map(url => fetch(url).then(response => response.arrayBuffer()))
      .map(async (buffer, i) => ({
        name: font,
        style: 'normal',
        weight: weights[i],
        data: await buffer,
      }))
  ) as any;
};
