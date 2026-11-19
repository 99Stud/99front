import type { SignatureLink } from '@lib/pages/Signature/signature';

import type { SocialLink } from '@99Stud/payload-types';

type SocialLinkRow = NonNullable<SocialLink['links']>[number];

// A link of the "Social Links" global as offered on the email-signature admin page
export type SignatureLinkChoice = SignatureLink & { key: string; picked: boolean };

// What identifies a row: its id, or its URL while the global has never been saved. Until its
// first save Payload fills in the default links with new ids on every read, so ids cannot
// identify a row then.
const linkKey = ({ id, href }: SocialLinkRow, isSaved: boolean) => (isSaved && id) || href;

export const toSignatureLinkChoices = (socialLinks: SocialLink): SignatureLinkChoice[] => {
  const isSaved = !!socialLinks.createdAt;

  return (socialLinks.links ?? []).map((link) => ({
    key: linkKey(link, isSaved),
    label: link.label,
    href: link.href,
    picked: !!link.showInSignature,
  }));
};

// The same rows with only their "show in signature" flag changed, ready to be saved.
// A key of either kind matches, so a page loaded before the first save still works after it.
export const withSignaturePick = (socialLinks: SocialLink, pickedKeys: string[]) =>
  (socialLinks.links ?? []).map((link) => ({
    ...link,
    showInSignature: [true, false].some((isSaved) => pickedKeys.includes(linkKey(link, isSaved))),
  }));
