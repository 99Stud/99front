// Policies are served at `/<slug>`, where these first path segments already belong to other
// routes or to folders of `public/`. Add the first segment of any new top-level route here.
const RESERVED_SLUGS = ['admin', 'api', 'assets', 'brand', 'libs'];

// Compared in lower case: the static folders are served case-insensitively on some hosts, and
// a typed slug is saved as typed
export const isReservedSlug = (slug: string): boolean =>
  RESERVED_SLUGS.includes(slug.toLowerCase());
