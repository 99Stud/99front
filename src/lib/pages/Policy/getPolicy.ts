import { getPayload } from 'payload';
import { cache } from 'react';

import config from '@payload-config';

import type { Policy } from '@99Stud/payload-types';

// Cached per request: the page and its metadata both need the document.
// Read errors are left to throw: there is no built-in text to fall back on, and an error page is
// more honest than a 404 for a policy that does exist.
export const getPolicy = cache(async (slug: string): Promise<Policy | null> => {
  const payload = await getPayload({ config });
  const { docs } = await payload.find({
    collection: 'policies',
    where: { slug: { equals: slug } },
    limit: 1,
    // Populates the documents targeted by internal links
    depth: 1,
    // Apply the collection's read access, which hides drafts from visitors
    overrideAccess: false,
  });
  return docs[0] ?? null;
});
