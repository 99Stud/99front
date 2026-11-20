'use server';

import { headers } from 'next/headers';
import { getPayload } from 'payload';

import { toSignatureLinkChoices, withSignaturePick } from '@lib/pages/Signature/signatureLinks';
import type { SignatureLinkChoice } from '@lib/pages/Signature/signatureLinks';

import config from '@payload-config';

// Saves, for the whole team, which social links the email signature shows.
// A Server Function is reachable by anyone who can post to the site: it checks the login itself.
export const saveSignatureLinks = async (pickedKeys: string[]): Promise<SignatureLinkChoice[]> => {
  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: await headers() });
  if (!user) throw new Error('Unauthorized');

  if (!Array.isArray(pickedKeys) || !pickedKeys.every((key) => typeof key === 'string')) {
    throw new Error('Invalid signature links');
  }

  // Read the links again rather than trusting the page: labels and URLs edited in the meantime
  // are kept, only the "show in signature" flag changes
  const socialLinks = await payload.findGlobal({ slug: 'social-links' });
  const saved = await payload.updateGlobal({
    slug: 'social-links',
    data: { links: withSignaturePick(socialLinks, pickedKeys) },
    overrideAccess: false,
    user,
  });

  return toSignatureLinkChoices(saved);
};
