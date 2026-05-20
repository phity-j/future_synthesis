import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://phity-j.github.io',
  base: '/future_synthesis',
  integrations: [sitemap()],
});
