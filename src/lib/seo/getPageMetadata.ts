import { getPayload } from 'payload';

import { DEFAULT_SEO, TITLE_TEMPLATE } from '@lib/seo/constants';

import config from '@payload-config';

import type { Media } from '@99Stud/payload-types';
import type { Metadata } from 'next';

type OpenGraphImages = NonNullable<Metadata['openGraph']>['images'];

// Media URLs are relative (`/api/media/file/...`); the root layout's `metadataBase` makes them absolute
const toOpenGraphImages = (image: Media | number | null | undefined): OpenGraphImages => {
  if (!image || typeof image === 'number' || !image.url) return undefined;
  return [
    {
      url: image.url,
      alt: image.alt,
      width: image.width ?? undefined,
      height: image.height ?? undefined,
      type: image.mimeType ?? undefined,
    },
  ];
};

const getSiteSeo = async () => {
  try {
    const payload = await getPayload({ config });
    const { meta } = await payload.findGlobal({ slug: 'site-seo', depth: 1 });
    return {
      title: meta?.title || DEFAULT_SEO.title,
      description: meta?.description || DEFAULT_SEO.description,
      images: toOpenGraphImages(meta?.image),
    };
  } catch (error) {
    // Pages must still render with sensible metadata if the database is unreachable
    // eslint-disable-next-line no-console
    console.error('Could not load site SEO from the CMS', error);
    return { ...DEFAULT_SEO, images: undefined };
  }
};

type PageMetadataOptions = {
  // Route path, used for the canonical link and `og:url`
  path: string;
  // Page name, suffixed with the site name; omit to use the CMS site title as-is (home page)
  title?: string;
};

// Metadata for an indexable page: the CMS-managed description and share image, plus the page's
// own title and canonical URL
export const getPageMetadata = async ({ path, title }: PageMetadataOptions): Promise<Metadata> => {
  const seo = await getSiteSeo();
  // Set in full here: the layout's `title.template` does not reach `openGraph.title`
  const fullTitle = title ? TITLE_TEMPLATE.replace('%s', title) : seo.title;
  return {
    title: { absolute: fullTitle },
    description: seo.description,
    alternates: { canonical: path },
    openGraph: {
      type: 'website',
      url: path,
      title: fullTitle,
      description: seo.description,
      images: seo.images,
    },
  };
};
