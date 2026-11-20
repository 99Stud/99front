import { describe, expect, it } from 'vitest';

import { resolveInternalLink } from '@lib/richText/resolveInternalLink';

describe('resolveInternalLink', () => {
  it('links to the public page of the linked policy', () => {
    const target = { relationTo: 'policies', value: { id: 1, slug: 'privacy-policy' } };
    expect(resolveInternalLink(target)).toBe('/privacy-policy');
  });

  it('stays on the page when the linked document was not loaded', () => {
    expect(resolveInternalLink({ relationTo: 'policies', value: 1 })).toBe('#');
    expect(resolveInternalLink({ relationTo: 'policies', value: null })).toBe('#');
    expect(resolveInternalLink(undefined)).toBe('#');
  });

  it('stays on the page when the linked document has no public page', () => {
    expect(resolveInternalLink({ relationTo: 'users', value: { id: 1, slug: 'someone' } })).toBe(
      '#',
    );
    expect(resolveInternalLink({ relationTo: 'policies', value: { id: 1 } })).toBe('#');
  });
});
