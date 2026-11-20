const ALLOWED_PROTOCOLS = ['https:', 'mailto:'];

// How the editor filled the link in: a typed address, or a document picked in the CMS
type LinkType = 'custom' | 'internal' | (string & {});

// Rich text links are rendered as link targets: only web and email addresses, never
// `javascript:` and the like. An internal link has no address to check: its target is a document.
// Returns `true` or the message shown to the editor, as Payload's field validation expects.
export const validateLinkUrl = (
  value: string | null | undefined,
  linkType?: LinkType | null,
): string | true => {
  if (linkType === 'internal') return true;
  try {
    const { protocol } = new URL(value ?? '');
    if (ALLOWED_PROTOCOLS.includes(protocol)) return true;
  } catch {
    // fall through to the error message
  }
  return 'Enter a full web address starting with https://, or an email address starting with mailto:';
};
