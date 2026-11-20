import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { getCloudflareContext } from '@opennextjs/cloudflare';
import { sqliteD1Adapter } from '@payloadcms/db-d1-sqlite';
import { resendAdapter } from '@payloadcms/email-resend';
import { seoPlugin } from '@payloadcms/plugin-seo';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { r2Storage } from '@payloadcms/storage-r2';
import { buildConfig } from 'payload';

import { SIGNATURE_VIEW_PATH } from '@components/admin/Signature/constants';

import { Media } from './collections/Media';
import { Posts } from './collections/Posts';
import { Users } from './collections/Users';
import { SiteSeo } from './globals/SiteSeo';
import { SocialLinks } from './globals/SocialLinks';
import { SITE_URL } from './lib/seo/constants';

import type { CloudflareContext } from '@opennextjs/cloudflare';
import type { GetPlatformProxyOptions } from 'wrangler';

// Adapted from Payload's official `with-cloudflare-d1` template.

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const realpath = (value: string) => {
  try {
    return fs.existsSync(value) ? fs.realpathSync(value) : undefined;
  } catch {
    return undefined;
  }
};

// The Payload CLI and `next build`/`next dev` run in Node, outside the Workers runtime
const isCLI = process.argv.some((value) => {
  const resolved = realpath(value);
  if (!resolved) return false;
  return (
    resolved.endsWith(path.join('payload', 'bin.js')) ||
    resolved.endsWith(path.join('next', 'dist', 'bin', 'next'))
  );
});
const isProduction = process.env.NODE_ENV === 'production';

// Workers Builds runs the same build for every branch. Any branch but main is a preview build and
// must never reach production data, so it resolves bindings from wrangler.preview.jsonc.
// `PAYLOAD_BINDINGS=preview` forces the same thing by hand (see `preview:database`).
const ciBranch = process.env.WORKERS_CI_BRANCH;
const usePreviewBindings =
  process.env.PAYLOAD_BINDINGS === 'preview' || (!!ciBranch && ciBranch !== 'main');

/* eslint-disable no-console */
const createLog =
  (level: string, fn: typeof console.log) => (objOrMsg: object | string, msg?: string) => {
    if (typeof objOrMsg === 'string') {
      fn(JSON.stringify({ level, msg: objOrMsg }));
    } else {
      fn(JSON.stringify({ level, ...objOrMsg, msg: msg ?? (objOrMsg as { msg?: string }).msg }));
    }
  };

// Payload's default logger (pino) writes with `fs.write`, which Workers does not implement
const cloudflareLogger = {
  level: process.env.PAYLOAD_LOG_LEVEL || 'info',
  trace: createLog('trace', console.debug),
  debug: createLog('debug', console.debug),
  info: createLog('info', console.log),
  warn: createLog('warn', console.warn),
  error: createLog('error', console.error),
  fatal: createLog('fatal', console.error),
  silent: () => {},
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any;
/* eslint-enable no-console */

// In Node, bindings come from wrangler's proxy: local D1/R2 in dev, the remote ones for
// production CLI runs such as `payload migrate` (the preview database when `usePreviewBindings`).
function getCloudflareContextFromWrangler(): Promise<CloudflareContext> {
  return import(/* webpackIgnore: true */ `${'__wrangler'.replaceAll('_', '')}`).then(
    ({ getPlatformProxy }) =>
      getPlatformProxy({
        configPath: usePreviewBindings
          ? path.resolve(dirname, '../wrangler.preview.jsonc')
          : undefined,
        environment: process.env.CLOUDFLARE_ENV,
        remoteBindings: isProduction,
      } satisfies GetPlatformProxyOptions),
  );
}

const cloudflare =
  isCLI || !isProduction
    ? await getCloudflareContextFromWrangler()
    : await getCloudflareContext({ async: true });

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      afterNavLinks: ['/components/admin/Signature/SignatureNavLink#SignatureNavLink'],
      views: {
        // Internal email-signature tool. Payload does not guard custom views: the component
        // itself sends logged-out visitors to the login.
        signature: {
          Component: '/components/admin/Signature/SignatureView#SignatureView',
          path: SIGNATURE_VIEW_PATH,
          exact: true,
          meta: { title: 'Email signature' },
        },
      },
    },
  },
  auth: {
    // Workers' WebCrypto rejects Payload's default of 600,000 PBKDF2 iterations
    passwordHashIterations: 100000,
  },
  collections: [Posts, Media, Users],
  globals: [SiteSeo, SocialLinks],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: sqliteD1Adapter({ binding: cloudflare.env.D1 }),
  // Auth emails (password reset) and `payload.sendEmail`. cms.99stud.com is the domain verified
  // in Resend.
  email: resendAdapter({
    defaultFromAddress: 'noreply@cms.99stud.com',
    defaultFromName: '99stud',
    apiKey: process.env.RESEND_API_KEY || '',
  }),
  logger: isProduction ? cloudflareLogger : undefined,
  plugins: [
    seoPlugin({
      globals: [SiteSeo.slug],
      uploadsCollection: Media.slug,
      // Shown in the admin's search-result preview; the global describes the home page
      generateURL: () => SITE_URL,
    }),
    r2Storage({
      bucket: cloudflare.env.R2,
      collections: { media: true },
    }),
  ],
});
