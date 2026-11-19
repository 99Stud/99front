import type { GlobalConfig } from 'payload';

// The SEO plugin injects its `meta` group (title, description, image) into this global
// (see payload.config.ts). The values are read by the public pages' `generateMetadata`.
export const SiteSeo: GlobalConfig = {
  slug: 'site-seo',
  label: 'Site SEO',
  access: {
    read: () => true,
  },
  admin: {
    description:
      'Title, description and share image used by search engines and link previews. Empty fields fall back to the built-in defaults.',
  },
  fields: [],
};
