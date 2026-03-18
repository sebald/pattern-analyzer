import { GoogleAnalytics } from '@next/third-parties/google';

export const Analytics = () => (
  <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || ''} />
);
