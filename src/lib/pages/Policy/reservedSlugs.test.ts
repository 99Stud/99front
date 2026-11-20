import { describe, expect, it } from 'vitest';

import { isReservedSlug } from '@lib/pages/Policy/reservedSlugs';

describe('isReservedSlug', () => {
  it('keeps policies off the addresses of the admin, the API and the static folders', () => {
    for (const slug of ['admin', 'api', 'assets', 'brand', 'libs']) {
      expect(isReservedSlug(slug)).toBe(true);
    }
  });

  it('is not fooled by capital letters', () => {
    expect(isReservedSlug('Admin')).toBe(true);
    expect(isReservedSlug('API')).toBe(true);
  });

  it('lets a policy use any other slug', () => {
    expect(isReservedSlug('legal-notice')).toBe(false);
    expect(isReservedSlug('administration')).toBe(false);
  });
});
