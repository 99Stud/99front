// Policies are served at `/<slug>`, where these first path segments already belong to other
// routes or to folders of `public/`
const RESERVED_SLUGS = ['admin', 'api', 'assets', 'brand', 'libs'];

export const isReservedSlug = (slug: string): boolean => RESERVED_SLUGS.includes(slug);
