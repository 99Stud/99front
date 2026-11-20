import { getPayload } from 'payload';

import { DEFAULT_SOCIAL_LINKS } from '@lib/pages/Home/constants';
import { homeLinks, type SocialLinkRow } from '@lib/pages/Home/homeLinks';

import config from '@payload-config';

export const getSocialLinks = async (): Promise<SocialLinkRow[]> => {
  try {
    const payload = await getPayload({ config });
    const { links } = await payload.findGlobal({ slug: 'social-links' });
    return homeLinks(links ?? []);
  } catch (error) {
    // The home page must still render if the database is unreachable
    // eslint-disable-next-line no-console
    console.error('Could not load social links from the CMS', error);
    return homeLinks(DEFAULT_SOCIAL_LINKS);
  }
};
