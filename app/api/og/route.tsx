import { type NextRequest, ImageResponse } from 'next/server';

import { Analyzer, Logo, Pattern } from './components';

// Handler
// ---------------
export const GET = async (req: NextRequest) => {
  const url = new URL(req.url);
  const title = url.searchParams.get('title');

  if (!title) {
    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 128,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f1f5fc',
            background: 'radial-gradient(circle, #b4c5ed 5%, transparent 6%)',
            backgroundSize: '50px 50px',
          }}
        >
          <Logo />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <Pattern />
            <Analyzer />
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  }
};
