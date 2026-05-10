// astro.config.mjs
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://podcast.mt',
  // No adapters needed — fully static output
  output: 'static',
});
