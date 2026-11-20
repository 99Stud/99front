import { getPayload } from 'payload';
import { cache } from 'react';

import { DEFAULT_LEGAL_NOTICE, LEGAL_NOTICE_SLUG } from '@lib/pages/Policy/constants';

import config from '@payload-config';

import type { Policy } from '@99Stud/payload-types';

export type PolicyPageContent = Pick<Policy, 'title' | 'content'>;

// Cached per request: the page and its metadata both need the document
export const getPolicy = cache(async (slug: string): Promise<PolicyPageContent | null> => {
  try {
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
  } catch (error) {
    // Other policies have no built-in text: an error page is more honest than a 404 for a policy
    // that does exist
    if (slug !== LEGAL_NOTICE_SLUG) throw error;
    // eslint-disable-next-line no-console
    console.error('Could not load the legal notice from the CMS', error);
    return DEFAULT_LEGAL_NOTICE;
  }
});
