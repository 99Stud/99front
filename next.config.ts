import { withPayload } from '@payloadcms/next/withPayload';

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Each build worker loads the Payload config, which starts a wrangler proxy on the shared
  // `.wrangler/state` SQLite files; several at once fail with SQLITE_BUSY.
  experimental: { cpus: 1 },
  // Packages with Cloudflare Workers (workerd) specific code
  // https://opennext.js.org/cloudflare/howtos/workerd
  serverExternalPackages: ['jose', 'pg-cloudflare'],
  headers: async () => [
    {
      // WebGL assets and decoders are not content-hashed: cache for a day, then serve the cached
      // copy while revalidating in the background
      source: '/:dir(assets|libs)/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=86400, stale-while-revalidate=2592000',
        },
      ],
    },
    {
      // Internal email-signature tool: keep it out of search engines
      source: '/brand/signature',
      headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
    },
  ],
};

export default withPayload(nextConfig, { devBundleServerPackages: false });
