import { describe, expect, it, beforeEach } from 'vitest';

import { app, rateLimitMap } from '../app.js';

const ENDPOINT = '/api/yasb/xws';

// Real YASB params: Luke + Wedge with upgrades
const validParams = {
  f: 'Rebel Alliance',
  d: 'v9ZsZ20Z4X124WW136Y5X127WW3',
  sn: 'Test Squad',
  obs: '',
};

const toQuery = (params: Record<string, string>) =>
  new URLSearchParams(params).toString();

const get = (path: string) =>
  app.request(path, { method: 'GET' });

describe('GET /api/yasb/xws', () => {
  beforeEach(() => {
    rateLimitMap.clear();
  });

  it('converts valid YASB params to XWS', async () => {
    const res = await get(`${ENDPOINT}?${toQuery(validParams)}`);
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.faction).toBe('rebelalliance');
    expect(body.name).toBe('Test Squad');
    expect(body.pilots).toHaveLength(2);
  });

  it('returns pilots with correct structure', async () => {
    const res = await get(`${ENDPOINT}?${toQuery(validParams)}`);
    const body = await res.json();

    for (const pilot of body.pilots) {
      expect(pilot).toHaveProperty('id');
      expect(pilot).toHaveProperty('ship');
      expect(pilot).toHaveProperty('upgrades');
    }
  });

  it('works without obs param', async () => {
    const { obs: _, ...paramsWithoutObs } = validParams;
    const res = await get(`${ENDPOINT}?${toQuery(paramsWithoutObs)}`);
    expect(res.status).toBe(200);
  });

  it('returns 400 when required params are missing', async () => {
    const res = await get(`${ENDPOINT}?f=Rebel+Alliance`);
    expect(res.status).toBe(400);
  });

  it('returns 400 when no params provided', async () => {
    const res = await get(ENDPOINT);
    expect(res.status).toBe(400);
  });

  it('returns 200 with empty pilots for unrecognized data string', async () => {
    const res = await get(
      `${ENDPOINT}?${toQuery({ ...validParams, d: 'invalid' })}`
    );
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.faction).toBe('rebelalliance');
    expect(body.pilots).toHaveLength(0);
  });
});

describe('GET /health', () => {
  beforeEach(() => {
    rateLimitMap.clear();
  });

  it('returns ok', async () => {
    const res = await get('/health');
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.status).toBe('ok');
  });
});

describe('rate limiting', () => {
  beforeEach(() => {
    rateLimitMap.clear();
  });

  it('allows requests under the limit', async () => {
    const res = await get('/health');
    expect(res.status).toBe(200);
  });

  it('returns 429 when rate limit is exceeded', async () => {
    // Fill up the rate limit (60 requests)
    for (let i = 0; i < 60; i++) {
      await get('/health');
    }

    // 61st request should be rate limited
    const res = await get('/health');
    expect(res.status).toBe(429);

    const body = await res.json();
    expect(body.error).toBe('Too many requests');
  });
});

describe('CORS', () => {
  beforeEach(() => {
    rateLimitMap.clear();
  });

  it('includes CORS headers', async () => {
    const res = await app.request('/health', {
      method: 'OPTIONS',
      headers: { Origin: 'https://example.com' },
    });

    expect(res.headers.get('access-control-allow-origin')).toBeTruthy();
  });
});
