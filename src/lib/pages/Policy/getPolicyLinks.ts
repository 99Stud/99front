import { getPayload } from 'payload';

import { DOCUMENT_PATHS } from '@lib/documentPaths';

import config from '@payload-config';

export type PolicyLink = { label: string; href: string };

// The legal notice is seeded by the `policies` migration
const DEFAULT_POLICY_LINKS: PolicyLink[] = [
  { label: 'Legal Notice', href: DOCUMENT_PATHS.policies('legal-notice') },
];

// Links to every published policy, so renaming, unpublishing or adding one in the CMS never
// leaves the site with a dead or missing link
export const getPolicyLinks = async (): Promise<PolicyLink[]> => {
  try {
    const payload = await getPayload({ config });
    const { docs } = await payload.find({
      collection: 'policies',
      select: { title: true, slug: true },
      sort: 'createdAt',
      pagination: false,
      depth: 0,
      // Apply the collection's read access, which hides drafts from visitors
      overrideAccess: false,
    });
    return docs.map(({ title, slug }) => ({ label: title, href: DOCUMENT_PATHS.policies(slug) }));
  } catch (error) {
    // The home page must still render if the database is unreachable
    // eslint-disable-next-line no-console
    console.error('Could not load policy links from the CMS', error);
    return DEFAULT_POLICY_LINKS;
  }
};
