import type { Metadata } from 'next';
import { baseUrl } from './config';

export interface MetadataConfig {
  title: string;
  description?: string;
  ogTitle?: string;
  ogWidth?: number;
}

export const createMetadata = ({
  title,
  description,
  ogTitle,
  ogWidth,
}: MetadataConfig) => {
  const ogParams = new URLSearchParams({
    ...(ogTitle ? { title: ogTitle } : {}),
    ...(ogWidth ? { width: `${ogWidth}` } : {}),
  }).toString();

  return {
    title: `${title} | Pattern Analyzer`,
    description: description ?? 'X-Wing tournament data & statistics',
    applicationName: 'Pattern Analyzer',
    appleWebApp: {
      title: 'Pattern Analyzer',
    },
    metadataBase: new URL('https://www.pattern-analyzer.app/'),
    openGraph: {
      siteName: 'Pattern Analyzer',
      title: 'Home',
      description: description ?? 'X-Wing tournament data & statistics',
      images: `${baseUrl}/api/og.png${ogParams ? `?${ogParams}` : ''}`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      creator: '@sebastiansebald',
    },
    themeColor: [
      { media: '(prefers-color-scheme: light)', color: '#3c4073' },
      { media: '(prefers-color-scheme: dark)', color: '#96a6e3' },
    ],
    other: {
      'msapplication-TileColor': '#96a6e3',
    },
  } satisfies Metadata;
};
