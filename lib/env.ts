import { Vendor } from '@/lib/types';

export const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL ??
  `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;

export const RECENT_EVENTS: {
  vendor: Vendor;
  id: string;
}[] = [
  {
    vendor: 'listfortress',
    id: '3696',
  },
];
