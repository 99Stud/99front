const ALLOWED_PROTOCOLS = ['https:', 'mailto:'];

// Rich text links are rendered as link targets: only web and email addresses, never
// `javascript:` and the like. Returns `true` or the message shown to the editor, as Payload's
// field validation expects.
export const validateLinkUrl = (value: string | null | undefined): string | true => {
  try {
    const { protocol } = new URL(value ?? '');
    if (ALLOWED_PROTOCOLS.includes(protocol)) return true;
  } catch {
    // fall through to the error message
  }
  return 'Enter a full web address starting with https://, or an email address starting with mailto:';
};
