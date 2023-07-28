import { type NextRequest, ImageResponse } from 'next/server';
import shipIcons from '@/lib/data/ship-icons.json';
import { getShipName } from '@/lib/get-value';

// Config
// ---------------
export const runtime = 'edge';

// Logo
// ---------------
const Logo = ({ size }: { size: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    stroke-width="2"
    width={size}
    height={size}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z"
    />
  </svg>
);

// Fonts
// ---------------
const loadInter = fetch(
  new URL('../../fonts/Inter-Black.ttf', import.meta.url)
).then(async res => res.arrayBuffer());
const loadMontserrat = fetch(
  new URL('../../fonts/Montserrat-Black.ttf', import.meta.url)
).then(async res => res.arrayBuffer());
const loadXWingShips = fetch(
  new URL('../../fonts/xwing-miniatures-ships.ttf', import.meta.url)
).then(async res => res.arrayBuffer());

// Handler
// ---------------
export const GET = async (req: NextRequest) => {
  const url = new URL(req.url);
  const title = url.searchParams.get('title') || '';
  const ships = url.searchParams.get('ships');
  const width = url.searchParams.get('width');

  const [inter, montserrat, shipFont] = await Promise.all([
    loadInter,
    loadMontserrat,
    loadXWingShips,
  ]);

  const content =
    title || ships ? (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          ...(width ? { width: `${width}%` } : { maxWidth: '80%' }),
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
            fontSize: title.length > 40 || ships ? 90 : 110,
            fontWeight: 900,
            lineHeight: 1,
            // @ts-ignore
            textWrap: 'balance',
          }}
        >
          {title}
        </div>
        {ships && (
          <div
            style={{
              color: '#3c4073',
              fontFamily: 'Ships',
              fontSize: 200,
              fontWeight: 400,
              lineHeight: 0.8,
            }}
          >
            {ships
              .split('.')
              // @ts-expect-error
              .map(ship => shipIcons[ship])
              .join(' ')}
          </div>
        )}
      </div>
    ) : (
      <>
        <Logo size="340" />
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
            fontSize: 90,
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
      width: 1_200,
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
        {
          name: 'Ships',
          weight: 400,
          style: 'normal',
          data: shipFont,
        },
      ],
    }
  );
};
