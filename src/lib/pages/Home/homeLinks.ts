import type { SocialLink } from '@99Stud/payload-types';

export type SocialLinkRow = NonNullable<SocialLink['links']>[number];

// "Show on home page" is on by default, so only a link explicitly unticked is left out
export const homeLinks = (links: SocialLinkRow[]): SocialLinkRow[] =>
  links.filter((link) => link.showOnHome !== false);
