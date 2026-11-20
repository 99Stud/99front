import { generatePageMetadata } from '@payloadcms/next/views';

import { ADMIN_META, CMS_NAME } from './constants';

import type { Metadata } from 'next';

type Args = Parameters<typeof generatePageMetadata>[0];

// Payload's not-found view is the one view that ignores `admin.meta`, and it is what a logged-out
// visitor gets on an unknown admin URL: without this it keeps Payload's name and favicons.
export const getAdminPageMetadata = async (args: Args): Promise<Metadata> => {
  const metadata = await generatePageMetadata(args);
  if (metadata.openGraph?.siteName === CMS_NAME) return metadata;

  const title = `${metadata.title} ${ADMIN_META.titleSuffix}`;
  return {
    ...metadata,
    title,
    icons: ADMIN_META.icons,
    openGraph: { ...ADMIN_META.openGraph, title },
  };
};
