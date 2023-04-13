import { type NextRequest, ImageResponse } from 'next/server';

import { Logo } from './helpers';

// Handler
// ---------------
export const GET = async (req: NextRequest) => {
  const url = new URL(req.url);
  const title = url.searchParams.get('title');

  const [inter, montserrat] = await Promise.all(
    ['/Inter-Black.ttf', '/Montserrat-Black.ttf'].map(async path => {
      const res = await fetch(new URL(path, import.meta.url));
      return res.arrayBuffer();
    })
  );

  const content = title ? (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '80%',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          color: '#6167ca',
          fontFamily: 'Montserrat',
          fontWeight: 900,
          fontSize: 32,
          textTransform: 'uppercase',
          lineHeight: 1,
        }}
      >
        <Logo size="40" /> <span>Pattern Analyzer</span>
      </div>
      <div
        style={{
          color: '#3c4073',
          fontSize: title.length > 40 ? 90 : 110,
          fontWeight: 900,
          lineHeight: 1,
          // @ts-ignore
          textWrap: 'balance',
        }}
      >
        {title}
      </div>
    </div>
  ) : (
    <>
      <Logo size="256" />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 0,
          fontFamily: 'Montserrat',
          fontWeight: 900,
          textTransform: 'uppercase',
          lineHeight: 1,
          fontSize: 80,
        }}
      >
        <span>Pattern</span>
        <span>Analyzer</span>
      </div>
    </>
  );

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          color: '#3c4073',
          fontFamily: 'Inter',
          backgroundColor: '#f1f5fc',
          background: 'radial-gradient(circle, #b4c5ed 5%, transparent 6%)',
          backgroundSize: '50px 50px',
        }}
      >
        {content}
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Inter',
          weight: 900,
          style: 'normal',
          data: inter,
        },
        {
          name: 'Montserrat',
          weight: 900,
          style: 'normal',
          data: montserrat,
        },
      ],
    }
  );
};
