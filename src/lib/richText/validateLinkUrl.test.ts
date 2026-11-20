import { describe, expect, it } from 'vitest';

import { validateLinkUrl } from '@lib/richText/validateLinkUrl';

describe('validateLinkUrl', () => {
  it('accepts https web addresses and email addresses', () => {
    expect(validateLinkUrl('https://99stud.com/legal-notice')).toBe(true);
    expect(validateLinkUrl('mailto:hello@99stud.com')).toBe(true);
  });

  it('refuses addresses that could run code or leave https', () => {
    for (const url of ['javascript:alert(1)', 'http://99stud.com', 'data:text/html,hi']) {
      expect(validateLinkUrl(url)).toEqual(expect.stringContaining('https://'));
    }
  });

  it('has no address to check on a link to a CMS document', () => {
    expect(validateLinkUrl(undefined, 'internal')).toBe(true);
    expect(validateLinkUrl('http://99stud.com', 'custom')).toEqual(
      expect.stringContaining('https://'),
    );
  });

  it('refuses text that is not a full address', () => {
    for (const url of ['99stud.com', '/legal-notice', '', null, undefined]) {
      expect(validateLinkUrl(url)).toEqual(expect.stringContaining('https://'));
    }
  });
});
