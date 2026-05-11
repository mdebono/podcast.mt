// astro.config.mjs
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel/static';

export default defineConfig({
  site: 'https://podcast.mt',
  output: 'static',
  adapter: vercel({
    webAnalytics: { enabled: true },
  }),
});
