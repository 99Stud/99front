import { SITE_URL } from '@lib/seo/constants';

import type { MetaConfig } from 'payload';

export const CMS_NAME = '99stud CMS';

// `admin.meta` of the Payload config: the titles, favicon and share image of the admin's pages
export const ADMIN_META = {
  titleSuffix: `- ${CMS_NAME}`,
  // Replaces Payload's own favicons; the file is src/app/favicon.ico
  icons: [{ rel: 'icon', type: 'image/x-icon', url: '/favicon.ico' }],
  // Payload's generated image is served from `/api/og` and resolved against `serverURL`, which is
  // unset here, so its tag points at localhost. One static image instead, with an absolute URL
  // like the site's own share images.
  defaultOGImageType: 'off',
  openGraph: {
    siteName: CMS_NAME,
    description: 'Content management for 99stud.com.',
    images: [
      {
        url: `${SITE_URL}/brand/99stud-cms-share.png`,
        width: 1200,
        height: 630,
        alt: CMS_NAME,
      },
    ],
  },
} satisfies MetaConfig;
