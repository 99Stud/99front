import { withPayload } from '@payloadcms/next/withPayload';

import type { NextConfig } from 'next';

// Logo files renamed after the logos they hold (see GLOSSARY.md). Sent emails and pasted email
// signatures still load the old URLs.
const RENAMED_BRAND_FILES = {
  '99stud-logo-dark.png': '99stud-sticker-logo.png',
  '99stud-logo-dark.svg': '99stud-sticker-logo.svg',
  '99stud-logo.png': '99stud-solid-logo.png',
  '99stud-logo.svg': '99stud-solid-logo.svg',
  '99stud-mark-white.svg': '99stud-outline-logo.svg',
};

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Each build worker loads the Payload config, which starts a wrangler proxy on the shared
  // `.wrangler/state` SQLite files; several at once fail with SQLITE_BUSY.
  experimental: { cpus: 1 },
  // Packages with Cloudflare Workers (workerd) specific code
  // https://opennext.js.org/cloudflare/howtos/workerd
  serverExternalPackages: ['jose', 'pg-cloudflare'],
  redirects: async () => [
    {
      // www is routed to the Worker (see wrangler.jsonc) only to be sent to the apex
      source: '/:path*',
      has: [{ type: 'host', value: 'www.99stud.com' }],
      destination: 'https://99stud.com/:path*',
      permanent: true,
    },
    {
      // The email-signature tool moved into the CMS admin: keep old bookmarks working
      source: '/brand/signature',
      destination: '/admin/signature',
      permanent: true,
    },
    ...Object.entries(RENAMED_BRAND_FILES).map(([from, to]) => ({
      source: `/brand/${from}`,
      destination: `/brand/${to}`,
      permanent: true,
    })),
  ],
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
  ],
};

export default withPayload(nextConfig, { devBundleServerPackages: false });
