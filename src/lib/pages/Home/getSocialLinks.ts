import { getPayload } from 'payload';

import { DEFAULT_SOCIAL_LINKS } from '@lib/pages/Home/constants';

import config from '@payload-config';

export type SocialLink = { id?: string | null; label: string; href: string };

const onHome = (links: (SocialLink & { showOnHome?: boolean | null })[]): SocialLink[] =>
  links.filter((link) => link.showOnHome);

export const getSocialLinks = async (): Promise<SocialLink[]> => {
  try {
    const payload = await getPayload({ config });
    const { links } = await payload.findGlobal({ slug: 'social-links' });
    return onHome(links ?? []);
  } catch (error) {
    // The home page must still render if the database is unreachable
    // eslint-disable-next-line no-console
    console.error('Could not load social links from the CMS', error);
    return onHome(DEFAULT_SOCIAL_LINKS);
  }
};
