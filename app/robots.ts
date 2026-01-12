import type { MetadataRoute } from 'next';

const robots = (): MetadataRoute.Robots => ({
  rules: [
    {
      userAgent: '*',
      allow: '/',
    },
    {
      userAgent: [
        'GPTBot',
        'CCBot',
        'anthropic-ai',
        'ClaudeBot',
        'Google-Extended',
        'Bytespider',
        'FacebookBot',
        'Omgilibot',
        'Diffbot',
      ],
      disallow: '/',
    },
  ],
});

export default robots;
