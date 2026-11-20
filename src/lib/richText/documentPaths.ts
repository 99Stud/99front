import type { CollectionSlug } from 'payload';

// Public route of the documents of each collection that has one. The single place to extend when
// a collection gets a route (the blog): the editor's internal links, the RichText component and
// the pages all read it.
export const DOCUMENT_PATHS = {
  policies: (slug: string) => `/${slug}`,
} satisfies Partial<Record<CollectionSlug, (slug: string) => string>>;

export type LinkableCollection = keyof typeof DOCUMENT_PATHS;

export const LINKABLE_COLLECTIONS = Object.keys(DOCUMENT_PATHS) as LinkableCollection[];

export const isLinkableCollection = (collection: string): collection is LinkableCollection =>
  collection in DOCUMENT_PATHS;
