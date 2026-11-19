import type { SignatureLink } from '@lib/pages/Signature/signature';

import type { SocialLink } from '@99Stud/payload-types';

// A link of the "Social Links" global as offered on the email-signature admin page.
// `key` is the row id, or the URL while the global has never been saved: until then Payload fills
// in the default links with new ids on every read, so they cannot identify a row.
export type SignatureLinkChoice = SignatureLink & { key: string; picked: boolean };

export const toSignatureLinkChoices = (socialLinks: SocialLink): SignatureLinkChoice[] => {
  const isSaved = !!socialLinks.createdAt;

  return (socialLinks.links ?? []).map(({ id, label, href, showInSignature }) => ({
    key: (isSaved && id) || href,
    label,
    href,
    picked: !!showInSignature,
  }));
};

// The same rows with only their "show in signature" flag changed, ready to be saved.
// Keys of either kind are accepted, so a page loaded before the first save still matches after it.
export const withSignaturePick = (socialLinks: SocialLink, pickedKeys: string[]) =>
  (socialLinks.links ?? []).map((link) => ({
    ...link,
    showInSignature: pickedKeys.includes(link.href) || (!!link.id && pickedKeys.includes(link.id)),
  }));
