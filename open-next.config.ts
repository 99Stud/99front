import { defineCloudflareConfig } from '@opennextjs/cloudflare';

const config = {
  ...defineCloudflareConfig(),
  // The package `build` script is the OpenNext build itself (it is what Workers Builds runs), so
  // OpenNext must not call it back
  buildCommand: 'pnpm exec next build',
};

export default config;
